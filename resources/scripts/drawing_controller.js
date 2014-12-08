
//Receieves All Nodes associated with a parent and draws it.
function drawLinks(cMap, nodeLinks, parent)
{
	
	for(k=0;k<nodeLinks.length;k++)
	{ // go through each connected node
		var index = cMap.findNode(nodeLinks[k]); // find the position for this node
		if(cMap.nodeList[index].properties.drawn == "n") // check if its drawn
		{
			drawNode(cMap.nodeList[index].properties.name, cMap.nodeList[index].properties.time,"node");
			$("#"+ cMap.nodeList[index].properties.name).data("parent", {name: parent.name});
			editNode(cMap.nodeList[index].properties.name, cMap.nodeList[index].properties.label);
			positionWeb(cMap.nodeList[index].properties.name, k, nodeLinks.length, parent);
			cMap.nodeList[index].properties.drawn = "y";
		}
	}
}

function drawNode(name, time, type){
	var divTag = document.createElement("div");
	divTag.id = name;
	divTag.className = type;
	document.getElementById("map").appendChild(divTag);
}

function editNode(id, content) {
	document.getElementById(id).innerHTML = "<div class='node_wrapper'><p>"+content+"</p></div>";
	$("#"+id).data("clicked", {count: 0});
}


function positionWeb(name, counter, length, parent)
{
	var $map = $("#map");
	var mapX = $(".node:first").offset().left;
	var mapY = $(".node:first").offset().top;
	
	var parentName = "#"+parent.name;
	var targetName = "#"+name;
	var parentPosition = $(parentName).offset();
	
	//When only 1 child
	if(counter == 0 && length == 1) {
	
	var grandParent = $(parentName).data("parent").name;
	var gParentX = $("#"+grandParent).offset().left;
	var gParentY = $("#"+grandParent).offset().top;
	var gpDiffX = parentPosition.left - gParentX;
	var gpDiffY = parentPosition.top -gParentY ;
	
	$(targetName).offset({top:(parentPosition.top + gpDiffY) , left: (parentPosition.left + gpDiffX)});
	}
	else {
	
	var radius = 320;
	var fullCircle = (Math.PI/2);
	//When Root Node - draw a full circle of children
	if($(parentName).data("parent").name == "root"){
	console.log("root detected");
		fullCircle = fullCircle *4;
		var angle = ((( fullCircle/length) * counter));
		console.log(angle);
	}
	else {
	// slightly larger than 1/4 circle
	var angle = ((( fullCircle/length) * counter)) * 1.5;
	}
	var xCoord = (Math.cos(angle) * radius);
	var yCoord = (Math.sin(angle) * radius);

	switch(findQuadrant(parentPosition, mapX, mapY)) {
	case "Bottom Left":xCoord = xCoord * -1; break;
	case "Top Left": xCoord = xCoord * -1; yCoord = yCoord * -1; break;
	case "Top Right": yCoord = yCoord * -1; break;
	}	
	$(targetName).offset({top:(parentPosition.top+ yCoord) , left: (parentPosition.left+xCoord)});
	}
	checkOverlap(targetName, mapX, mapY);
}

//uses plugin to check if the target node overlaps any other node, if so - move it appropriately
function checkOverlap(targetNode, mapX, mapY){
	while($(targetNode).overlaps(".node").length >0)
	{
		switch(findQuadrant($(targetNode).offset(), mapX, mapY)) {

			case "Bottom Left":	
			$(targetNode).offset({left: $(targetNode).offset().left - 10});
			$(targetNode).offset({top: $(targetNode).offset().left + 10});
		break;
			
			case "Top Left": 
			$(targetNode).offset({left: $(targetNode).offset().left - 10});
			$(targetNode).offset({top: $(targetNode).offset().left - 10});
		break;

			case "Top Right": 
			$(targetNode).offset({left: $(targetNode).offset().left + 10});
			$(targetNode).offset({top: $(targetNode).offset().left - 10});
		break;
			
			case "Bottom Right": 
			$(targetNode).offset({left: $(targetNode).offset().left + 10});
			$(targetNode).offset({top: $(targetNode).offset().left + 10});
		break;
		
		}
	}
}

function findQuadrant(node, centerX, centerY)
{
	var quadrant;
	if(node.left < centerX)
	{
		if(node.top < centerY){
			quadrant = "Top Left";
		}
		else{ quadrant = "Bottom Left";}
	}
	else if(node.top<centerY)
		{
		quadrant = "Top Right";
		}
	else{ quadrant = "Bottom Right"; }
	return quadrant;

}
// the map may have grown offscreen, in which case the nodes are all shifted so that all nodes are visible.
function fixPosition(){
	$(".node").each(function(){
		while($("#"+this.id).offset().top < $("#map").offset().top+50){
		shiftDown();
		}
		while($("#"+this.id).offset().left < $("#map").offset().left+50){
		shiftRight();
		}
	});

}

function shiftRight(){
	$(".node").each(function(){
		$("#"+this.id).offset({left: $("#"+this.id).offset().left + 50});
	});
}

function shiftDown(){
	$(".node").each(function(){
		$("#"+this.id).offset({top: $("#"+this.id).offset().top + 50});
	});
}

// resizes the map container in order to encompass the new map which could've grown off of the container as well as ensuring the container is large enough to make scrolling possible to all nodes.
function fixContainer(){
var nodeRight;
var nodeDown;
var furthestRight = 400 , furthestDown = 600;
	$(".node").each(function(){
		if($("#"+this.id).offset().left > furthestRight){
		nodeRight = this.id;
		furthestRight = $("#"+this.id).offset().left + $("#"+this.id).width();
		}
		if($("#"+this.id).offset().top > furthestDown){
		nodeDown = this.id;
		furthestDown = $("#"+this.id).offset().top + $("#"+this.id).height();
		}
	});

	$(".node").each(function(){
	$("#"+this.id).offset({left: $("#"+this.id).offset().left + (furthestRight)});
	$("#"+this.id).offset({top: $("#"+this.id).offset().top + (furthestDown)});
	});
	
	$("#map").width((furthestRight*2)+$("#"+nodeRight).width()+($("#map").width()/2));
	$("#map").height((furthestDown*2)+$("#"+nodeDown).height()+($("#map").height()/2));
	
}
