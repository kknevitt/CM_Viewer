function TimeManager(){

	var timerSlider;
	var syncTimer;
	var syncTimeAmount = 0;
	var currentTime;
	var maxTime = map.getLength();
	var recentNodeTime = 0;
	var recentNode;
	var settings = "auto";
	
this.start = function (){
	if(timerSlider == null){
		syncTimer = setInterval(function(){if(syncTimeAmount < maxTime){syncTimeAmount += 1000}}, 1000)
		timerSlider = setInterval(function(){
		currentTime = $( "#slider" ).slider( "value" );
		$( "#slider" ).slider( "value", currentTime + 1000);
		},1000);
	}
}

this.onSliderChange = function(){
	currentTime = $( "#slider" ).slider( "value" );

	if(currentTime < maxTime){
		$(map.nodeList).each(function(){
			var time = parseInt(this.properties.time);
			var selector = this.properties.name;
			if(time <= currentTime){
				$("#"+selector).addClass('pastNode', 1000);
				if(time > recentNodeTime){
				recentNode = selector;
				}
				
			}
			if(time > currentTime){
				$("#"+selector).removeClass('pastNode',1000);
				$("#"+selector).removeClass('currentNode',1000);
			}
		});	
	
			if(recentNode != map.getCurrentNode()){
			
				selectCurrentNode(recentNode);
				setRightInfo(recentNode);
				if(settings == "auto"){
				console.log(settings);
				jQuery("#map_container").stop(true);
					scrollToNode(recentNode);
				}
			}	
	}
	else if(currentTime == maxTime){ this.pause();}
	this.updateTime(currentTime);
}


this.pause = function(){
 clearInterval(timerSlider);
 timerSlider = null;
}
this.stop = function(){
 clearInterval(timerSlider);
 timerSlider = null;
 clearInterval(syncTimer);
 $( "#slider" ).slider( "value", 0 );
}

this.sync = function(){
scrollToNode(recentNode);
 $( "#slider" ).slider( "value", syncTimeAmount);
}

this.manualControl = function(){
settings = "manual";
$("#map_container").css({overflow: 'auto'});
}

this.autoControl = function(){
settings = "auto";
$("#map_container").css({overflow: 'hidden'});
scrollToNode(recentNode, 100);
}

this.getCurrentTime = function(){
return currentTime;
}

this.updateTime = function(timeUpdate){
var time = timeUpdate;
var minutes = Math.floor(time/60000);
var seconds = (time - (minutes * 60000))/1000;
$("#currentTime").text("Time: "+minutes+":"+seconds);
}

}