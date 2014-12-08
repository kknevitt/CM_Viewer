//Concept Map object holds all the data loaded from the xml doc including nodes and lines, and provides methods for retrieving them.
function ConceptMap() {

	var title = "title";
	var length = 0;
	var selectedNode = "noneSelected";
	var currentNode = "noneCurrent";
	this.nodeList = [];
	this.lineList = [];
	
	this.setTitle = function(title){ this.title = title;};
	this.setLength = function(length){ this.length = length;};
	this.getTitle = function() { return this.title;};
	this.getLength = function() { return this.length;};
	this.setSelectedNode = function(node) { this.selectedNode = node;};
	this.setCurrentNode = function(node) { this.currentNode = node;};
	this.getSelectedNode = function(node) {return this.selectedNode;};
	this.getCurrentNode = function(){return this.currentNode};
	
	
	this.giveLineTime = function(lineto) {
		for(lineTimeIndex=0;lineTimeIndex<this.nodeList.length;lineTimeIndex++){ 
			if(this.nodeList[lineTimeIndex].properties.id == lineto){
				return this.nodeList[lineTimeIndex].properties.time
				}
	}};

	this.answeredQuestion = function(id, verdict){
		for(var qIndex=0;qIndex<this.nodeList.length;qIndex++) {
			if(id == this.nodeList[qIndex].properties.name){
				this.nodeList[qIndex].quiz.answered = "y"; 
				if(verdict == true){this.nodeList[qIndex].quiz.correctly = true;
				}
				else{ 
					this.nodeList[qIndex].quiz.correctly= false;
					}
			}
		}
	}
	
	this.findPic = function(id) {
		for(var picIndex=0;picIndex<this.nodeList.length;picIndex++) {
			if(id == this.nodeList[picIndex].properties.name){
			return this.nodeList[picIndex].properties.pic;
			}
		}
	}
	this.findInfo = function(id) {
		for(var infoIndex=0;infoIndex<this.nodeList.length;infoIndex++) {
			if(id == this.nodeList[infoIndex].properties.name) {
				return this.nodeList[infoIndex].properties.indepth_info;
			}
		}
	}
	this.findNode = function(id) {
		for(l=0;l<this.nodeList.length;l++) {
			if(id == this.nodeList[l].properties.name){
				return l;
			}
		}
	}
	
	this.addNode = function(node) {
		this.nodeList[this.nodeList.length] = node;
		this.nodeList[this.nodeList.length-1].id = (this.nodeList.length - 1);
	};
	
	this.addLine = function(line) {
		this.lineList[this.lineList.length] = line;
	};
	
	this.sortNodes = function() { 
		this.nodeList.sort(compare);
	};
	
	this.findData = function(id) {
		var dataArr;
		for(var dataIndex=0;dataIndex<this.nodeList.length;dataIndex++) {
			if(id == this.nodeList[dataIndex].properties.name) 
			{
			dataArr = this.nodeList[dataIndex].properties;
			}
		};return dataArr;
	}
	
	this.getQuiz = function(id){
		for(var dataIndex=0;dataIndex<this.nodeList.length;dataIndex++) {
			if(id == this.nodeList[dataIndex].properties.name) {
				return this.nodeList[dataIndex].quiz;
			}
		}
	}


}

function conceptNode(){

this.properties = {name: ["nodeName"], label: ["nodeLabel"], time: ["nodeTime"], quote:["quote from show"], brief_info: ["simple"], indepth_info: ["addInfo"], pic: ["noPic"], 
id:["noId"], drawn: ["n"], timeRemaining: ["n/a"]};
this.quiz = {question: ["question"], type:["concOrDesc"], correct_answer: ["cAnswer"], answered: ["n"], correctly: ["?"]};
}


//For Sorting the nodeList by time. - Looked Up
function compare(a,b) {
	if(parseInt(a.propertiestime) < parseInt(b.properties.time)){
		return -1;}
	if(parseInt(a.properties.time) > parseInt(b.properties.time)){
		return 1;}
	return 0;
}

