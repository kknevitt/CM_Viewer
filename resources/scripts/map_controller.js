//Takes in a map object to populate given the desired xml file. 
function generateMap(cMap, xmlDoc)
{
	//setting nodes, setting the properties and then the quiz elements into a node object.
	var allNodes =xmlDoc.getElementsByTagName("node");
	for (xmlNodes=0;xmlNodes<allNodes.length;xmlNodes++)
		{
		concNode = new conceptNode();
		var propChildren=xmlDoc.getElementsByTagName("properties")[xmlNodes].childNodes;
		var y=xmlDoc.getElementsByTagName("properties")[xmlNodes].firstChild;
		
		for (child=0;child<propChildren.length;child++)
		  {
			if (y.nodeType==1 && y.nodeName == "name"){
				concNode.properties.name = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "label"){
				concNode.properties.label = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "quote"){
				concNode.properties.quote = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "brief_info"){
				concNode.properties.brief_info = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName == "time"){
				concNode.properties.time = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName ==  "indepth_info"){
				concNode.properties.indepth_info = y.firstChild.nodeValue;}
			if (y.nodeType==1 && y.nodeName ==  "pic"){
				concNode.properties.pic = y.firstChild.nodeValue;}
			y=y.nextSibling;
		  } 
		
		var quizChildren=xmlDoc.getElementsByTagName("quiz")[xmlNodes].childNodes;
		var z = xmlDoc.getElementsByTagName("quiz")[xmlNodes].firstChild;
		var answerCount = 0;
		
		
		for (qchild=0;qchild<quizChildren.length;qchild++)
		{
		
		if(z.nodeType==1 && z.nodeName == "question"){
		concNode.quiz.question = z.firstChild.nodeValue;
			if(z.getAttributeNode("type").value == "conceptual"){ 
				concNode.quiz.type = "conceptual";
			} 
			else {concNode.quiz.type = "factual";}
		}
		if(z.nodeType==1 && z.nodeName == "answer" && z.getAttributeNode("correct").value == "true"){
			concNode.quiz.correct_answer = z.firstChild.nodeValue;	
			answerCount++;
		}
		if(z.nodeType==1 && z.nodeName == "answer" && z.getAttributeNode("correct").value == "false"){
			concNode.quiz["wrong_answer"+answerCount] = z.firstChild.nodeValue;
			answerCount++;
		}
		z=z.nextSibling;
		}
		
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
	  
	  // setting metadata for the map, needed in order for the slider / timers to work.
  		var title=xmlDoc.getElementsByTagName("title")[0].firstChild.nodeValue;
		var length = xmlDoc.getElementsByTagName("length")[0].firstChild.nodeValue;
		cMap.setTitle(title);
		cMap.setLength(length);
}

//For Sorting the nodeList by time. - Looked Up
function compare(a,b) {
	if(parseInt(a.propertiestime) < parseInt(b.properties.time)){
		return -1;}
	if(parseInt(a.properties.time) > parseInt(b.properties.time)){
		return 1;}
	return 0;
}

//given the data of a map - draws the first node then checks if each node has a child in order to draw it, which means all will get drawn as the nodes are in order of time.
function drawMap(cMap)
{
	var links = [];
	drawNode(cMap.nodeList[0].properties.name, cMap.nodeList[0].properties.time,"node");  //draw first node.
	editNode(cMap.nodeList[0].properties.name, cMap.nodeList[0].properties.label);
	var firstNode = document.getElementById(cMap.nodeList[0].properties.name);
	firstNode.className = "node";
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