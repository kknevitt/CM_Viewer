xmlDoc=loadXMLDoc("Map_Data.xml");
	// need find title function
var map = new conceptMap("Concept Map");

$(document).ready(function(){
						
	generateMap(map);
	checkChildren();			
			
	$("#btn1").click(function(){
		$(".node").stop();
		$(".node").hide();
		$(".line").stop();
		$(".line").hide();

	});

	$("#btn2").click(function(){
		$(map.nodeList).each(function(){
			var selector = "#"+this.name;
			var timer = parseInt(this.time);
			$(selector).delay(timer).fadeTo("slow", 1);
		});

		$(map.lineList).each(function(){
			var selector = "#"+this.name;
			var timer = map.giveLineTime(this.to);
			$(selector).delay(timer).fadeIn();
		});
	});
	
		var dynamicAnchors = [ [ 0.2, 0, 0, -1 ],  [ 1, 0.2, 1, 0 ], 
	[ 0.8, 1, 0, 1 ], [ 0, 0.8, -1, 0 ] ];

	var plumb = jsPlumb.getInstance({
		PaintStyle:{ 
		lineWidth:6, 
		strokeStyle:"#567567", 
		outlineColor:"white", 
		outlineWidth:1 
		},
		Connector:[ "Bezier", { curviness: 50 } ],
		Endpoint:[ "Dot", { radius:5 } ],
		EndpointStyle : { fillStyle: "black"  }
	});
	jsPlumb.draggable($(".node"));

	$(map.lineList).each(function(){
		plumb.connect({source:(this).from, target:(this).to, anchor:dynamicAnchors});
	});
});

function conceptMap(title) {
	this.giveLineTime = function(lineto) {for(i=0;i<this.nodeList.length;i++){ if(this.nodeList[i].name == lineto){return this.nodeList[i].time}}};
	this.mapTitle = title;
	this.nodeList = [];
	this.lineList = [];
	this.findNode = function(name) {for(l=0;l<this.nodeList.length;l++) {if(name == this.nodeList[l].name) return l;}}
	this.addNode = function(node, id) {this.nodeList[this.nodeList.length] = node;};
	this.addLine = function(line, id) {this.lineList[this.lineList.length] = line;};
	this.showAllNodes = function() {for(i=0;i<this.nodeList.length;i++) {createDiv(this.nodeList[i].name, this.nodeList[i].time); editDiv(this.nodeList[i].name, this.nodeList[i].info);}} 
	this.showAllLines = function() {for(i=0;i<this.lineList.length;i++) {createDiv(this.lineList[i].name, this.lineList[i].time); editDiv(this.lineList[i].name, this.lineList[i].name);}}
	this.showChildren = function() {checkChildren(this.nodeList, this.lineList)}
}

function createDiv(name, time, type){
	var divTag = document.createElement("div");
	divTag.id = name;
	divTag.className = type;
	document.getElementById("map").appendChild(divTag);
}

function editDiv(id, content) {
	document.getElementById(id).innerHTML += content;
}

function generateMap(cMap)
{

	//setting nodes
	
	var allNodes =xmlDoc.getElementsByTagName("node");
	for (i=0;i<allNodes.length;i++)
		{
		var x=xmlDoc.getElementsByTagName("node")[i].childNodes;
		var y=xmlDoc.getElementsByTagName("node")[i].firstChild;
		var nodeContents = {name: ["value1"], info: ["value2"], time: ["value3"], drawn: ["n"]};
		for (j=0;j<x.length;j++)
		  {
		  if (y.nodeType==1 && y.nodeName == "name")
			{
			nodeContents.name = y.firstChild.nodeValue;
			}
			if (y.nodeType==1 && y.nodeName == "info"){
			nodeContents.info = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "time"){
			nodeContents.time = y.firstChild.nodeValue;}
			
			y=y.nextSibling;
		  } 
		  cMap.addNode(nodeContents);
	}
	
	//setting Lines
	
	var allLines = xmlDoc.getElementsByTagName("line");
		for (i=0;i<allLines.length;i++)
		{
		var x=xmlDoc.getElementsByTagName("line")[i].childNodes;
		var y=xmlDoc.getElementsByTagName("line")[i].firstChild;
		var lineContents = {name: ["value1"], from: ["value2"], to: ["value3"], drawn: ["n"]};
		
		for (j=0;j<x.length;j++)
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

function checkChildren()
{
	var links = [];
	createDiv(map.nodeList[0].name, map.nodeList[0].time,"node");  //draw first node.
	editDiv(map.nodeList[0].name, map.nodeList[0].name);
	var firstNode = document.getElementById(map.nodeList[0].name);
	firstNode.className = "firstNode";
	map.nodeList[0].drawn = "y";

	for(i=0;i<map.nodeList.length;i++) // go through each nodes
	{
		for(j=0;j<map.lineList.length;j++) //check for links
		{
			if(map.nodeList[i].name == map.lineList[j].from) // if the node is one that has lines coming from it
			{
			links.push(map.lineList[j].to); // add the name of the node it connects to
			}
		}
	drawLinks(links, map.nodeList[i]); // draw the nodes within this array and connect them to the parent
	links.length=0;
	}
}

function drawLinks(nodeLinks, parent)
{
	for(k=0;k<nodeLinks.length;k++)
	{ // go through each connected node
		var index = map.findNode(nodeLinks[k]); // find the position for this node
		if(map.nodeList[index].drawn == "n") // check if its drawn
		{
			createDiv(map.nodeList[index].name, map.nodeList[index].time,"node");
			editDiv(map.nodeList[index].name, map.nodeList[index].name + " link:"+k);
			positionDiv(map.nodeList[index].name, k, nodeLinks.length, parent);
			map.nodeList[index].drawn = "y";
		}
	}
}

function positionDiv(name, counter, length, parent)
{
	var parentName = "#"+parent.name;
	var targetName = "#"+name;
	var parentPosition = $(parentName).offset();
	$(targetName).offset({top:(parentPosition.top+(-150+((300/length)*counter))) , left: (parentPosition.left+150)});
}
			  