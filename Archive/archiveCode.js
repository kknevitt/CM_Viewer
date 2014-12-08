//Archive Code


//old logging
function logInteraction(element, interactionLog){
var entry = {id: ["value1"], time: ["value2"], currentNode: ["value3"], className: ["value4"]};
var className = element.className;
var name = element.id;
var time = new Date().getTime() / 1000;
var node = "test";
entry.id = name;
entry.time = time;
entry.currentNode = node;
entry.className = className;
interactionLog.push(entry);
}

// old timers.
	this.setTimedNodes = function() { 
		$(map.nodeList).each(function(){
		var timer = parseInt(this.properties.time);
		var selector = this.properties.name;
		var timerID = setTimeout(function(){  this.currentNode = selector; selectCurrentNode(selector); setRightInfo(selector); scrollToNode(selector); },timer);
		this.properties.timerID = timerID;

		});
	}

