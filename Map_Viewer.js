xmlDoc=loadXMLDoc("Map_Data.xml");
var map = new conceptMap("Concept Map");

$(document).ready(function(){

//FIX
	$(window)._scrollable();
	generateMap(map);
	map.sortNodes();
	addNodeList();
	drawMap();
	fixPosition();
	fixContainer();
	$( "#tabs" ).tabs();

	/*
	console.log("map", $("#map").offset());
	$(".node").each(function(){
		console.log(this.id, $(this).offset());
	});
	*/
	
	var node;
	var opacity;
	//fixOverlaps();
			
	$("#btn1").click(function(){
		$(".node").stop();
		$(".node").animate({ opacity:"0.1"});
	});

	$("#btn2").click(function(){
		$(map.nodeList).each(function(){
			var selector = "#"+this.name;
			var timer = parseInt(this.time);
			$(selector).delay(timer).fadeTo("slow", 1);
		//	$.scrollTo( $(selector), 800, {offset: {top:+100, left:+200}});
		});
		
	});
	$( ".node" ).click(function() {
	
		/*
		$( ".node" ).animate ({backgroundColor: "#0D4949"}, 200,  function () {});
		$( this ).animate ({backgroundColor: "#418C75"}, 200,  function () {});
	//	var text = $(this).text();
		node = (this).id;
		opacity = $(this).css("opacity")
		$(this).fadeTo("fast", 1);

		}
		var position = $(this).offset();
		var instance = jsPlumb.getInstance({
		});
		instance.animate(this, {left: (position.left + 10)+"px", top: (position.top + 10)+"px"}, { duration:500, easing:'easeOutBack' });
		*/
		opacity = $(this).css("opacity")
		$(this).fadeTo("fast", 1);
		$(this).toggleClass( "selected", 500 );
		var info = map.findInfo(this.id);
		if(info != " "){
		$("#info_box").html(info);
		}
		var pic = map.findPic(this.id);
		var img = $('<img>');
		$("#picBox").append(img);
		img.attr('class', "infoPic");
		img.attr('src', pic);
		
		
	});
	
	$( ".nodeList" ).click(function() {
	/*
	var nodeString = this.id;
	nodeStringArray = nodeString.split("_");
	console.log(nodeStringArray[0]);
	//$.scrollTo( $(), 800, {offset: {top:+100, left:+200}});
	*/
	var height = $("#"+$(this).data("nodeLink").name).height()/2;
	var width = $("#"+$(this).data("nodeLink").name).width()/2;
	
	var offsetTop = ($(window).height() / 2)*-1;
	var offsetLeft = ($(window).width() / 2)*-1;
	$.scrollTo( $("#"+$(this).data("nodeLink").name), 1500, {offset: {top:offsetTop+height, left: offsetLeft+width}});
	
	});
	
	$("#map").not($(node)).click(function() {
	$(node).fadeTo("fast", 0);
	$(node).animate ({backgroundColor: "#0D4949"}, 200,  function () {});
	
	});
	
	
	

	jsPlumb.ready(function() {
		var dynamicAnchors = [ [ 1, 0, 0, -1 ],  [ 1, 0.2, 1, 0 ], [ 0.8, 1, 0, 1 ], [ 0, 0.8, -1, 0 ] ];
		var instance = jsPlumb.getInstance({
		});
		instance.draggable($(".node"));
		
		$(map.lineList).each(function(){	
			var plumb = instance.connect({
			source: this.from,
			target: this.to,
		//	anchor: dynamicAnchors,
			anchor: "Continuous",
			connector:["Bezier", { curviness:150 }],
			overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]],
			//connector:[ "Flowchart", { cornerRadius:30 } ],
			paintStyle:{lineWidth:5, strokeStyle:"#567567", outlineColor:"white", outlineWidth:1 },
		//	endPoint: "Blank",
			endpoint:[ "Dot", { radius:1 } ],
		//	endpointStyle : { fillStyle: "black"  },
			label: (this).name,
			hoverPaintStyle: {strokeStyle:"#2E4272"},
			labelStyle:{
			cssClass:"line_label"
		}
			});
			
		});
		
		/*
		initAnimation = function(elId) {
		var el = document.getElementById(elId),
				_el = jsPlumb.getElementObject(el);

			instance.on(el, 'click', function(e, ui) {

				e =jsPlumb.getOriginalEvent(e);
				var o = jsPlumbAdapter.getOffset(_el, instance, true),
					o2 = jsPlumbAdapter.getOffset(_el, instance),
					s = jsPlumb.getSize(el),
					pxy = [e.pageX || e.clientX, e.pageY || e.clientY],
					c = [pxy[0] - (o.left + (s[0]/2)), pxy[1] - (o.top + (s[1]/2))],
					oo = [c[0] / s[0], c[1] / s[1]],
					DIST = 350,
					l = o2.left + (oo[0] * DIST),
					t = o2.top + (oo[1] * DIST);

				var id = el.getAttribute("id");
				instance.animate(el, {left:l, top:t}, { duration:350, easing:'easeOutBack' });
			});
		}
		*/
		
		
	});	
});

function conceptMap(title) {
	this.giveLineTime = function(lineto) {for(lineTimeIndex=0;lineTimeIndex<this.nodeList.length;lineTimeIndex++){ if(this.nodeList[lineTimeIndex].id == lineto){return this.nodeList[lineTimeIndex].time}}};
	this.mapTitle = title;
	this.nodeList = [];
	this.lineList = [];
	this.findPic = function(id) {for(var picIndex=0;picIndex<this.nodeList.length;picIndex++) {if(id == this.nodeList[picIndex].name) return this.nodeList[picIndex].pic;}}
	this.findInfo = function(id) {for(var infoIndex=0;infoIndex<this.nodeList.length;infoIndex++) {if(id == this.nodeList[infoIndex].name) return this.nodeList[infoIndex].additional_info;}}
	this.findNode = function(id) {for(l=0;l<this.nodeList.length;l++) {if(id == this.nodeList[l].name) return l;}}
	this.addNode = function(node) { this.nodeList[this.nodeList.length] = node; this.nodeList[this.nodeList.length-1].id = (this.nodeList.length - 1);};
	this.addLine = function(line) {this.lineList[this.lineList.length] = line;};
	this.sortNodes = function() { this.nodeList.sort(compare);};
	this.showChildren = function() {checkChildren(this.nodeList, this.lineList)}
}

	function compare(a,b) {
	if(parseInt(a.time) < parseInt(b.time)){
	return -1;}
	if(parseInt(a.time) > parseInt(b.time)){
	return 1;}
	return 0;
	}

function createDiv(name, time, type){
	var divTag = document.createElement("div");
	divTag.id = name;
	divTag.className = type;
	document.getElementById("map").appendChild(divTag);
}

function editDiv(id, content) {
//	$("#"+id ).add("<span>").addClass("nodeContent");
//	$("#"+id +"span").text(content);
	document.getElementById(id).innerHTML = "<p>"+content+"</p>";
//	$("#"+id+" p").css("line-height", $("#"+id).height()+"px");
}

function generateMap(cMap)
{

	//setting nodes
	
	var allNodes =xmlDoc.getElementsByTagName("node");
	for (xmlNodes=0;xmlNodes<allNodes.length;xmlNodes++)
		{
		var x=xmlDoc.getElementsByTagName("node")[xmlNodes].childNodes;
		var y=xmlDoc.getElementsByTagName("node")[xmlNodes].firstChild;
		var nodeContents = {name: ["value1"], info: ["value2"], time: ["value3"], additional_info: ["addInfo"], pic: ["noPic"], id:["noId"], drawn: ["n"]};
		for (nodeChildren=0;nodeChildren<x.length;nodeChildren++)
		  {
		  if (y.nodeType==1 && y.nodeName == "name")
			{
			nodeContents.name = y.firstChild.nodeValue;
			}
			if (y.nodeType==1 && y.nodeName == "info"){
			nodeContents.info = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "time"){
			nodeContents.time = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName ==  "additional_info"){
			nodeContents.additional_info = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName ==  "pic"){
			nodeContents.pic = y.firstChild.nodeValue;}
			y=y.nextSibling;
		  } 	
		  cMap.addNode(nodeContents);
	}
	
	//setting Lines
	
	var allLines = xmlDoc.getElementsByTagName("line");
		for (xmlLines=0;xmlLines<allLines.length;xmlLines++)
		{
		var x=xmlDoc.getElementsByTagName("line")[xmlLines].childNodes;
		var y=xmlDoc.getElementsByTagName("line")[xmlLines].firstChild;
		var lineContents = {name: ["value1"], from: ["value2"], to: ["value3"], drawn: ["n"]};
		
		for (lineChildren=0;lineChildren<x.length;lineChildren++)
		  {
			if (y.nodeType==1 && y.nodeName == "name")
			{
			lineContents.name = y.firstChild.nodeValue;
			}
			if (y.nodeType==1 && y.nodeName == "from"){
			lineContents.from = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "to"){
			lineContents.to = y.firstChild.nodeValue;}
			y=y.nextSibling;
		  } 
		  cMap.addLine(lineContents);
		  }
  
}

function drawMap()
{
$(map.nodeList).each(function(){
//console.log(this.name, this.time);

});

$(map.lineList).each(function(){
//console.log(this.from, this.to);
});
	var links = [];
	createDiv(map.nodeList[0].name, map.nodeList[0].time,"node");  //draw first node.
	editDiv(map.nodeList[0].name, map.nodeList[0].info);
	var firstNode = document.getElementById(map.nodeList[0].name);
	firstNode.className = "node";
	firstNode.style.top = "50%";
	firstNode.style.left = "50%";
	map.nodeList[0].drawn = "y";
	console.log(firstNode.id);
	$("#"+firstNode.id).data("parent", {name: "root"});

	
	for(nodeLooping=0;nodeLooping<map.nodeList.length;nodeLooping++) // go through each nodes
	{
		for(linkCheck=0;linkCheck<map.lineList.length;linkCheck++) //check for links
		{
			if(map.nodeList[nodeLooping].name == map.lineList[linkCheck].from) // if the node is one that has lines coming from it
			{
			links.push(map.lineList[linkCheck].to); // add the id of the node it connects to
			}
		
		}
	drawLinks(links, map.nodeList[nodeLooping]); // draw the nodes within this array and connect them to the parent
	links.length=0;
	}
}


function drawLinks(nodeLinks, parent)
{
	var circleRadius = 250;
	for(k=0;k<nodeLinks.length;k++)
	{ // go through each connected node
		var index = map.findNode(nodeLinks[k]); // find the position for this node
		if(map.nodeList[index].drawn == "n") // check if its drawn
		{
			createDiv(map.nodeList[index].name, map.nodeList[index].time,"node");
			$("#"+ map.nodeList[index].name).data("parent", {name: parent.name});
			editDiv(map.nodeList[index].name, map.nodeList[index].info);
		//	positionDiv(map.nodeList[index].name, k, nodeLinks.length, parent);
			positionWeb(map.nodeList[index].name, k, nodeLinks.length, parent, circleRadius);
			map.nodeList[index].drawn = "y";
		}
	}
}

function positionDiv(name, counter, length, parent)
{
	var parentName = "#"+parent.name;
	var targetName = "#"+name;
	var parentPosition = $(parentName).offset();
	
	$(targetName).offset({top:(parentPosition.top+((-45*length)+(90*counter))) , left: (parentPosition.left+350)});
	
	while($(targetName).overlaps(".node").length > 0)
		{	
			$(targetName).css("left", "+=50"+"px");
		}	

}

function positionWeb(name, counter, length, parent, cRadius)
{

	var $map = $("#map");
	var mapX = $(".node:first").offset().left;
	var mapY = $(".node:first").offset().top;
	
	var parentName = "#"+parent.name;
	var targetName = "#"+name;
	var parentPosition = $(parentName).offset();

	if(counter == 0 && length == 1) {
	
	var dx = parentPosition.left - mapX;
	var dy = parentPosition.top - mapY;
	var lineLength = Math.sqrt(dx*dx + dy*dy);
	var newX = parentPosition.left +(dx * (lineLength));
	var newY = parentPosition.top + (dy * (lineLength));

	var grandParent = $(parentName).data("parent").name;
	var gParentX = $("#"+grandParent).offset().left;
	var gParentY = $("#"+grandParent).offset().top;
	var gpDiffX = parentPosition.left - gParentX;
	var gpDiffY = parentPosition.top -gParentY ;
	
	$(targetName).offset({top:(parentPosition.top + gpDiffY) , left: (parentPosition.left + gpDiffX)});

	//$(targetName).offset({top:(newY) , left: (newX)});
	}
	
	
	
	
	
	else {
		
	var radius = cRadius
	var fullCircle = (Math.PI/2);
	if($(parentName).data("parent").name == "root"){
	fullCircle = fullCircle *4;
	var angle = ((( fullCircle/length) * counter));
	}
	else {
	var angle = ((( fullCircle/length) * counter)) * 1.5; // OVER HERE
	}
	var xCoord = (Math.cos(angle) * radius);
	var yCoord = (Math.sin(angle) * radius);

	switch(findQuadrant(parentPosition, mapX, mapY)) {
	case "Bottom Left":xCoord = xCoord * -1; break;
	case "Top Left": xCoord = xCoord * -1; yCoord = yCoord * -1; break;
	case "Top Right": yCoord = yCoord * -1; break;
	}	
	
	$(targetName).offset({top:(parentPosition.top+ yCoord) , left: (parentPosition.left+xCoord)});
	//$(targetName).data({diffX: parentPosition.left-mapX, diffY: parentPosition.top - mapY});
	}
/*
	while($(targetName).overlaps(".node").length > 0)
	{
	console.log(targetName, "overlaps");
	console.log(findQuadrant($(targetName).offset(), mapX, mapY));
		switch(findQuadrant($(targetName).offset(), mapX, mapY)) {
			case "Bottom Left":	
			$(targetName).offset({left: $(targetName).offset().left - 10});
			$(targetName).offset({top: $(targetName).offset().left + 10});
		break;
			
			case "Top Left": 
			$(targetName).offset({left: $(targetName).offset().left - 10});
			$(targetName).offset({top: $(targetName).offset().left - 10});
		break;

			case "Top Right": 
			$(targetName).offset({left: $(targetName).offset().left + 10});
			$(targetName).offset({top: $(targetName).offset().left - 10});
		break;
			
			case "Bottom Right": 
			$(targetName).offset({left: $(targetName).offset().left + 10});
			$(targetName).offset({top: $(targetName).offset().left + 10});
		break;
		
		}
	}
*/
}


function findExtraAngle(parent)
{
var originX = ($("#map").width() / 2);
var originY= ($("#map").height() / 2);
var xLength = originX - parent.left;
var yLength = originX - parent.top;
var opposite;
var adjacent;
if(xLength < yLength){
oppposite = xLength; 
adjacent = yLength;

}

}

function findQuadrant(node, centerX, centerY)
{
console.log(node);
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
	console.log(quadrant);
	return quadrant;

}

//change 
function fixOverlaps(){
	var n=$(".node").overlaps().length;var vol=(100/n);var round=0;
	$(".node").overlaps().each(function(){
		$(this).css('left',((vol-1)*round)+"%");
		 $(this).css('width',(vol-n)+"%")
		$(".node").overlaps()
		round=round+1;
	});
}

function fixPosition(){
	$(".node").each(function(){
		while($("#"+this.id).offset().top < $("#map").offset().top+50){
		console.log(this.id, "is Above");
		shiftDown();
		}
		while($("#"+this.id).offset().left < $("#map").offset().left+50){
		console.log(this.id, "is Left");
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
	$("#map").width(furthestRight);
	$("#map").height(furthestDown);
}

function addNodeList(){
		$(map.nodeList).each(function(){	
		var nodeName = this.name;
		var div = $('<div></div>');
		$("#nodeList").append(div);
		div.attr('id', nodeName+"_nodeList");
		div.attr('class', "nodeList");
		$("#"+nodeName+"_nodeList").data("nodeLink", {name: nodeName});
		//looked up
		var content = nodeName.replace(/_/g, " ");
		$("#"+nodeName+"_nodeList").append( "<span>"+content+"</span>" );

		
		
		});
}




			  