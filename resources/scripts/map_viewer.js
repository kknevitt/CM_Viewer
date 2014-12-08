//Receiver to allow for executing commands
var Receiver = function(){
	this.selectAndUpdate = function()
		{
		map.setSelectedNode(this.nodeToSelect);
		setLeftInfo(this.nodeToSelect);
		$(".node").removeClass('selectedNode',600)
		$("#"+map.getSelectedNode()).addClass('selectedNode', 600);
		}
		
	this.correctAnswer = function()
		{
		
		$("#"+map.getSelectedNode()+"_nodeListEntry .qMarker").css({"background-color": "#b6e026"});
		map.answeredQuestion(map.getSelectedNode(), true);
		$("#verdict").css({"background-color": "#b6e026"});
		$("#verdict").text("That's right!");
		}
	this.wrongAnswer = function()
	{
		$("#"+map.getSelectedNode()+"_nodeListEntry .qMarker").css({"background-color": "#a90329"});
		map.answeredQuestion(map.currentNode, false);
		$("#verdict").css({"background-color": "#a90329"});
		$("#verdict").text("Sorry! Incorrect");
	}
	
	this.finishViewing = function()
	{
	giveResults(invoker.getStats());
	}
}

//Invoker that commands are sent to and stored, to be later queried.
var Invoker = function(){

	var commands = [];
	var stats = {interactionLog:	{selectAmount: 0,
	selectedWhileCurrent: 0, 
	interactAmount: 0, quoteAmount: 0, 
	briefExpAmount: 0, 
	additionalAmount: 0, 
	quizAmount: 0},
	quizResults: {questionsanswered: 0, questionsCorrect: 0, conceptualCorrect: 0, factualCorrect: 0}};

	this.store = function(command){
		commands.push(command);
	}
	this.storeAndExecute = function(command){
		commands.push(command);
		command.execute();
	}
	
	this.printCommands = function(){
	console.log(commands);
	}
	
	this.getStats = function(){
		this.calcStats();
		return stats;
	}
	//analyses commands to find out the amount each time has been made and what sub type of command has been made.
	this.calcStats = function(){
	
		$(commands).each(function(){
			if(this instanceof SelectNodeComm){
			stats.interactionLog.selectAmount++;
				if(this.selectedNode == this.currentNode){
				stats.interactionLog.selectedWhileCurrent++;
				}
			}
			
			if(this instanceof ReqInteractionComm){
			stats.interactionLog.interactAmount++;
			switch(this.type) {
			
				case "quote":	
				stats.interactionLog.quoteAmount++;
				break;

				case "explanation":	
				stats.interactionLog.briefExpAmount++;
				break;

				case "add_info":	
				stats.interactionLog.additionalAmount++;
				break;
				
				case "quiz_question":	
				stats.interactionLog.quizAmount++;
				break;
				}
			}
			
			if(this instanceof AnswerQuestionCorrectly || this instanceof AnswerQuestionIncorrectly){
			console.log(this.questionType);
				if(this.questionType == "conceptual"){
				stats.quizResults.conceptualCorrect++;
				}
				else {
				stats.quizResults.factualCorrect++;
				}
			stats.quizResults.questionsanswered++;
			}
			if(this instanceof AnswerQuestionCorrectly){
			stats.quizResults.questionsCorrect++;
			}


		});	
	}

}

//Initialising initial necessary resources used widely

var map;
var invoker = new Invoker();
var receiver = new Receiver();
var timeManager;

//Setting commands
var SelectNodeComm = function(nodeToSelect, currentNode, time){
this.label = "Select";
this.nodeToSelect = nodeToSelect;
this.time = time;
this.currentNode = currentNode;
this.execute = receiver.selectAndUpdate;
}

var ReqInteractionComm = function(selectedNode, currentNode, type, time){
this.label = "ReqInt";
this.selectedNode = selectedNode;
this.type = type;
this.time = time;
this.currentNode = currentNode;
}

var AnswerQuestionCorrectly = function(selectedNode, currentNode, time, type){
this.label = "Correct_Answer";
this.questionType = type;
this.selectedNode = selectedNode;
this.currentNode = currentNode;
this.time = time;
this.execute = receiver.correctAnswer;
}

var AnswerQuestionIncorrectly = function(selectedNode, currentNode, time, type){
this.label = "Correct_Answer";
this.selectedNode = selectedNode;
this.questionType = type;
this.currentNode = currentNode;
this.time = time;
this.execute = receiver.wrongAnswer;
}

var FinishCommand = function(time){
this.label = "Finish";

this.time = time;
this.execute = receiver.finishViewing;
}



function selectCurrentNode(node){
	var selector = "#"+node;
	map.setCurrentNode(node);
	$(".currentNode").removeClass('currentNode',1000)
	$(selector).addClass('currentNode', 1000);
}

//Allowing for the scrolling to a selected node, container details are needed in order to center it. 
function scrollToNode(node){

	var selector = "#"+node;
	var offsetTop = ($("#map_container").height() / 2)*-1;
	var offsetLeft = ($("#map_container").width() / 2)*-1;
	var height = $(selector).height()/2;
	var width = $(selector).width()/2;	
	$("#map_container").scrollTo((selector), 3500, {offset: {top:offsetTop+height, left: offsetLeft+width}});
}
function setRight(){

	$("#mapTitle").text(map.getTitle());
	
	$(map.nodeList).each(function(){	
	var nodeName = this.properties.name;
			
	var div = $('<div></div>');
	$("#nodeList").append(div);
	div.attr('id', nodeName+"_nodeListEntry");
	div.attr('class', "nodeListEntry");
	
	var qMarker = $('<div>&nbsp;</div>');
	$("#"+nodeName+"_nodeListEntry").append(qMarker);
	qMarker.attr('class', "qMarker");
	
	
	var entryName = $('<div></div>');
	$("#"+nodeName+"_nodeListEntry").append(entryName);
	entryName.attr('id', nodeName+"_nodeListEntry_name");
	entryName.attr('class', "nodeListEntry_name");
	
	var content = nodeName.replace(/_/g, " ");
	$("#"+nodeName+"_nodeListEntry_name").append( "<span>"+content+"</span>" );
	$("#"+nodeName+"_nodeListEntry").data("nodeLink", {name: nodeName});
	});
}

function setLeftInfo(node){
		
		var data = map.findData(node);
		var name = data.name;
		var nameFormatted = name.replace(/_/g, " ");
		
		// call back to allow for neater looking picture loading.
		$("#picBox img").fadeOut(500, function() {
        $("#picBox img").attr("src", data.pic);
        $("#picBox img").fadeIn(500);
		});
		
		$( "#title").text(nameFormatted);
		$( "#quote_content").text(data.quote);
		$( "#explanation_content").text(data.brief_info);
		$( "#add_info_content").text(data.indepth_info);
		setQuizQuestions(node);
		$( "#accordion" ).accordion( "refresh" );
}
//Setting the quiz questions for the selected node, finds the correct answer and as many wrong answers as have been entered putting data as needed, and randomises their position
function setQuizQuestions(node){

	var quizInfo = map.getQuiz(node);
	$( "#quiz_question_content").text(quizInfo.question);
	
	var correct = quizInfo.correct_answer;
	var type = quizInfo.type;
	var answerList = [];
	$("#quiz ul").empty();
	$("#notificationBox").empty();
	
	if(quizInfo.answered == "n"){
	for(var prop in quizInfo){
		if(prop.search("wrong_answer")!=-1){
		answerList.push(quizInfo[prop]);
		}
	}
	var randIndex = Math.floor((Math.random() * answerList.length));
	answerList.splice(randIndex, 0, correct);
	
	for(var i=0;i<answerList.length;i++){
		$("<li class='answer'/>").appendTo("#quiz ul").html(answerList[i]);
		var lastChild = $("#quiz ul li:last-child");
		lastChild.data("type", type);
		if(answerList[i] == correct){
			lastChild.data("answer", "correct");
			lastChild.attr("id","correct");
		}
		else {
			lastChild.data("answer", "wrong");
		}
		lastChild.click(checkAnswer);
	}
	$("#notificationBox").append("<div id='verdict'></div>");
	}
	else{
	$("<li class='answer' id='correct'/>").appendTo("#quiz ul").html(correct);
	}
}

function checkAnswer() {
var answer;
		if($(this).data("answer") == "correct"){
			answer = new AnswerQuestionCorrectly(map.getSelectedNode(), map.getCurrentNode(), timeManager.getCurrentTime(), $(this).data("type"));
			invoker.storeAndExecute(answer);
		}
		else{
			answer = new AnswerQuestionIncorrectly(map.getSelectedNode(), map.getCurrentNode(), timeManager.getCurrentTime(), $(this).data("type"));
			invoker.storeAndExecute(answer);
		}
		$("#verdict").css('visibility', 'visible');
		$("#verdict").show("slide",1000, hideAgain);
		//giving visual priority to the correct answer.
		$("#quiz ul li:not(#correct)").animate({ opacity:"0.1"});
		
		function hideAgain() {
			setTimeout(function() {
			$("#verdict").hide("slide", 1000);
			}, 1000 );
		};
 }
 

function setRightInfo(node){
$("#nodeInfo h3 span").text(node);
}

function scrollBarChange(){
timeManager.onSliderChange();
}

//Displays necessary stats, only for use in testing.
function giveResults(stats){
	var div = $('<div><p>Thank-you for Participating in this Interactive Map Viewing!<br>Here are the results:</p><ul></ul></div>');
	$("body").append(div);
	div.attr('id', "results");
	
	$.each(stats.quizResults, function( k, v ) {
	$("#results ul").append("<li>");
	$("#results ul li:last-child").text(k+": "+v);
	});
	
	$.each(stats.interactionLog, function( k, v ) {
	$("#results ul").append("<li>");
	$("#results ul li:last-child").text(k+": "+v);
	});

	
	$("#results").dialog({
      resizable: false,
      height:600,
	  width: 600,
      modal: true,
      buttons: {
        "Ok": function() {
          $( this ).dialog( "close" );
			}
		}
    });
}


$(document).ready(function(){

	map = new ConceptMap();
	var mapLocation = $.cookie('map');
	var xmlDoc=loadXMLDoc(mapLocation);

	//Main sequence of initalisations of necessary resources and drawing of visual elements.
	(function(){
	generateMap(map, xmlDoc);
	map.sortNodes();
	drawMap(map);
	fixPosition();
	fixContainer();
	setRight();
	})();
	
	// Automatically center to first node within the map.
	var offsetTop = ($("#map_container").height() / 2)*-1;
	var offsetLeft = ($("#map_container").width() / 2)*-1;
	var height = $(".node:first").height()/2;
	var width = $(".node:first").width()/2;
	$("#map_container").scrollTo($(".node:first"), 0, {offset: {top:offsetTop+height, left: offsetLeft+width}});
	
	
	// initialising jquery ui widgets
	(function(){
	$("button").button();
	
	$("#accordion").accordion({
		header: "h3",
		collapsible: false,
		heightStyle: "content",
		navigation: true 
	});
	
	$("#slider").slider({
      orientation: "horizontal",
      range: "min",
	  step: 1000,
      max: map.getLength(),
	  slide: scrollBarChange,
      change: scrollBarChange,
      value: 0
    });
	
	})();
	

	timeManager = new TimeManager();
	
	//setting of necessary events.
	(function(){
	$("#reset").click(function(){
		timeManager.stop();

	});
	
	$("#finish").click(function(){
		var finishCommand = new FinishCommand(timeManager.getCurrentTime());
		invoker.storeAndExecute(finishCommand);
		
	});
	
	
	$("#accordion h3").click(function(){
		var interactCommand = new ReqInteractionComm(map.getSelectedNode(), map.getCurrentNode(), this.id, timeManager.getCurrentTime());
		invoker.store(interactCommand);
	});
	
	$("#start").click(function(){
	timeManager.start();
	});
	
	$("#pause").click(function(){
	timeManager.pause();
	});
	
	$("#sync").click(function(){
	timeManager.sync();
	});
	
	$("#manual_style").click(function(){
	timeManager.manualControl();
	});
	
	$("#auto_style").click(function(){
	
	timeManager.autoControl();
	});
	
	$("#center_selected").click(function(){
	jQuery("#map_container").stop(true);
	$("#map_container").scrollTo($("#"+map.getSelectedNode()), 1000, {offset: {top:offsetTop+height, left: offsetLeft+width}});
	
	});
	
	$("#center_current").click(function(){
	jQuery("#map_container").stop(true);
	$("#map_container").scrollTo($("#"+map.getCurrentNode()), 1000, {offset: {top:offsetTop+height, left: offsetLeft+width}});
	});
	
	$( ".node" ).click(function() {

		var selectCommand = new SelectNodeComm(this.id, map.getCurrentNode(), timeManager.getCurrentTime());
		invoker.storeAndExecute(selectCommand);
		
		
		var clickCount = $(this).data("clicked").count;
		clickCount++;
		$(this).data("clicked", {count: clickCount});
		
	});
	
	$( ".nodeListEntry" ).click(function() {
	var selectCommand = new SelectNodeComm($(this).data("nodeLink").name, map.getCurrentNode(), timeManager.getCurrentTime());
	invoker.storeAndExecute(selectCommand);
	});
	
	$( ".nodeListEntry" ).hover(function(){
		$(this).stop().animate({
			right: -20}, 
		900, "easeOutBounce");
	}, function(){
		$(this).stop().animate({
			right: 0
			}, 900, "easeOutBounce");
			});

			
	
	$("#redraw").click(function(){
		
		$(map.nodeList).each(function(){	
		this.properties.drawn = "n";
			});
		$("#map").empty();
		drawMap(map);
		fixPosition();
		drawLines();
		var jinstance = jsPlumb.getInstance({});
		jinstance.draggable($(".node"));
		});
	
	})();
	
	
	//once jsPlumb has loaded, use it to draw each line specified from the data.
	jsPlumb.ready(function() {
		var instance = jsPlumb.getInstance({});
		
		drawLines = function() {
		$(map.lineList).each(function(){	
			var plumb = instance.connect({
			source: this.from,
			target: this.to,
			anchor: "Continuous",
			overlays:[ ["PlainArrow", {location:0.2, width:20, length:10, paintStyle: {fillStyle: "black"}}]],
			connector:["Bezier", { curviness:150 }],
			paintStyle:{lineWidth:20, strokeStyle:"#5C5C5C", outlineColor:"#402F73", outlineWidth:1},
			endPoint: "Blank",
			endpoint:[ "Dot", { radius:1 } ],
			endpointStyle : { fillStyle: "black", radius:5  },
			label: (this).name,
			hoverPaintStyle: {strokeStyle:"#2E4272"},
			labelStyle:{cssClass:"line_label"}
			});
		});	
		}
		drawLines();
		instance.draggable($(".node"));
	});	
});
