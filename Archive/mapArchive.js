function ConceptMap(title) {
	var selectedNode = "none";
	var currentNode = "none";
	this.giveLineTime = function(lineto) 
	{for(lineTimeIndex=0;lineTimeIndex<this.nodeList.length;lineTimeIndex++){ 
		if(this.nodeList[lineTimeIndex].properties.id == lineto){return this.nodeList[lineTimeIndex].properties.time}}};
	this.nodeList = [];
	this.lineList = [];
	this.timeList = [];
	this.currentTime = 0;
	this.quizScore = 0;
	
	this.setSelectedNode = function(node) { this.selectedNode = node;};
	this.setCurrentNode = function(node) { this.currentNode = node;};
	this.getSelectedNode = function(node) {return this.selectedNode;};
	this.getCurrentNode = function(){return this.currentNode};
	this.answeredQuestion = function(id, verdict){for(var qIndex=0;qIndex<this.nodeList.length;qIndex++) {if(id == this.nodeList[qIndex].properties.name){this.nodeList[qIndex].quiz.answered = "y"; if(verdict == true){this.nodeList[qIndex].quiz.correctly = true;}else{this.nodeList[qIndex].quiz.correctly= false;}}}}
	this.findPic = function(id) {for(var picIndex=0;picIndex<this.nodeList.length;picIndex++) {if(id == this.nodeList[picIndex].properties.name) return this.nodeList[picIndex].properties.pic;}}
	this.findInfo = function(id) {for(var infoIndex=0;infoIndex<this.nodeList.length;infoIndex++) {if(id == this.nodeList[infoIndex].properties.name) return this.nodeList[infoIndex].properties.indepth_info;}}
	this.findNode = function(id) {for(l=0;l<this.nodeList.length;l++) {if(id == this.nodeList[l].properties.name) return l;}}
	this.addNode = function(node) { this.nodeList[this.nodeList.length] = node; this.nodeList[this.nodeList.length-1].id = (this.nodeList.length - 1);};
	this.addLine = function(line) {this.lineList[this.lineList.length] = line;};
	this.sortNodes = function() { this.nodeList.sort(compare);};
	this.showChildren = function() {checkChildren(this.nodeList, this.lineList)};
	this.findData = function(id) {
	
	var dataArr = {label: 100, quote: 200, brief_info: 300, indepth_info: 400, pic: 500, name: 600, timerID: 700};
	for(var dataIndex=0;dataIndex<this.nodeList.length;dataIndex++) {

		if(id == this.nodeList[dataIndex].properties.name) 
		{dataArr.label = this.nodeList[dataIndex].properties.label;
		dataArr.quote = this.nodeList[dataIndex].properties.quote; 
		dataArr.brief_info = this.nodeList[dataIndex].properties.brief_info;
		dataArr.indepth_info = this.nodeList[dataIndex].properties.indepth_info;
		dataArr.pic = this.nodeList[dataIndex].properties.pic; 
		dataArr.name = this.nodeList[dataIndex].properties.name;
		dataArr.timeRemaining = this.nodeList[dataIndex].properties.timeRemaining}
		};return dataArr;
	}
	this.getQuiz = function(id){
	for(var dataIndex=0;dataIndex<this.nodeList.length;dataIndex++) {
	if(id == this.nodeList[dataIndex].properties.name) 
		{
		return this.nodeList[dataIndex].quiz;
		}
	}
	}


}

function generateMap(cMap)
{

	//setting nodes
	var allNodes =xmlDoc.getElementsByTagName("node");
	for (xmlNodes=0;xmlNodes<allNodes.length;xmlNodes++)
		{

		var nodeProperties = {name: ["value1"], label: ["value2"], time: ["value3"], quote:["quote from show"], brief_info: ["simple"], indepth_info: ["addInfo"], pic: ["noPic"], id:["noId"], drawn: ["n"], timeRemaining: ["n/a"]};
		var propChildren=xmlDoc.getElementsByTagName("properties")[xmlNodes].childNodes;
		var y=xmlDoc.getElementsByTagName("properties")[xmlNodes].firstChild;
		
		for (child=0;child<propChildren.length;child++)
		  {
			if (y.nodeType==1 && y.nodeName == "name"){
			nodeProperties.name = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "label"){
			nodeProperties.label = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "quote"){
			nodeProperties.quote = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "brief_info"){
			nodeProperties.brief_info = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "time"){
			nodeProperties.time = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName ==  "indepth_info"){
			nodeProperties.indepth_info = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName ==  "pic"){
			nodeProperties.pic = y.firstChild.nodeValue;}
			y=y.nextSibling;
		  } 
		
		var quizChildren=xmlDoc.getElementsByTagName("quiz")[xmlNodes].childNodes;
		var z = xmlDoc.getElementsByTagName("quiz")[xmlNodes].firstChild;
		var quizContents = {question: ["question"], type:["concOrDesc"], correct_answer: ["cAnswer"], answered: ["n"], correctly: ["?"]};
		var answerCount = 0;
		
		
		for (qchild=0;qchild<quizChildren.length;qchild++)
		{
		
		if(z.nodeType==1 && z.nodeName == "question"){
		quizContents.question = z.firstChild.nodeValue;
			if(z.getAttributeNode("type") == "conceptual")
			{ quizContents.type = "Conceptual";} 
			else {quizContents.type = "Descriptive";}
		}
		if(z.nodeType==1 && z.nodeName == "answer" && z.getAttributeNode("correct").value == "true"){
		quizContents.correct_answer = z.firstChild.nodeValue;	
		answerCount++;
		}
		if(z.nodeType==1 && z.nodeName == "answer" && z.getAttributeNode("correct").value == "false"){
		quizContents["wrong_answer"+answerCount] = z.firstChild.nodeValue;
		answerCount++;
		}
		z=z.nextSibling;
		}
		//concNode = new conceptNode(nodeProperties, quizContents);
		cMap.addNode(concNode);
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

function drawMap(cMap)
{
	var links = [];
	createDiv(cMap.nodeList[0].properties.name, cMap.nodeList[0].properties.time,"node");  //draw first node.
	editDiv(cMap.nodeList[0].properties.name, cMap.nodeList[0].properties.label);
	var firstNode = document.getElementById(cMap.nodeList[0].properties.name);
	firstNode.className = "node";
	firstNode.style.top = "50%";
	firstNode.style.left = "50%";
	cMap.nodeList[0].properties.drawn = "y";
	$("#"+firstNode.id).data("parent", {name: "root"});
	
	for(nodeLooping=0;nodeLooping<cMap.nodeList.length;nodeLooping++) // go through each nodes
	{
		for(linkCheck=0;linkCheck<cMap.lineList.length;linkCheck++) //check for links
		{
			if(cMap.nodeList[nodeLooping].properties.name == cMap.lineList[linkCheck].from) // if the node is one that has lines coming from it
			{
			links.push(cMap.lineList[linkCheck].to); // add the id of the node it connects to
			}
		}
	drawLinks(cMap, links, cMap.nodeList[nodeLooping].properties); // draw the nodes within this array and connect them to the parent
	links.length=0;
	}
}
//Receieves All Nodes associated with a parent and draws it.
function drawLinks(cMap, nodeLinks, parent)
{
	
	for(k=0;k<nodeLinks.length;k++)
	{ // go through each connected node
		var index = cMap.findNode(nodeLinks[k]); // find the position for this node
		if(cMap.nodeList[index].properties.drawn == "n") // check if its drawn
		{
			createDiv(cMap.nodeList[index].properties.name, cMap.nodeList[index].properties.time,"node");
			$("#"+ cMap.nodeList[index].properties.name).data("parent", {name: parent.name});
			editDiv(cMap.nodeList[index].properties.name, cMap.nodeList[index].properties.label);
			positionWeb(cMap.nodeList[index].properties.name, k, nodeLinks.length, parent);
			cMap.nodeList[index].properties.drawn = "y";
		}
	}
}
function conceptNode(properties, quiz){
this.properties = properties;
this.quiz = quiz;
}


//For Sorting the nodeList - Looked Up
function compare(a,b) {
	if(parseInt(a.propertiestime) < parseInt(b.properties.time)){
	return -1;}
	if(parseInt(a.properties.time) > parseInt(b.properties.time)){
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
	document.getElementById(id).innerHTML = "<div class='node_wrapper'><p>"+content+"</p></div>";
	$("#"+id).data("clicked", {count: 0});
}