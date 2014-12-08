$(document).ready(function(){

	$("#choices").dialog({
      resizable: false,
      height:350,
	  width: 600,
      modal: true
    });
	
	$(".button").button();
	
	$(".button").click(function(){
	var map = $(this).text();
	var mapLocation = "resources/data/"+map+"/map_data.xml";
	$.cookie('map', mapLocation);
	});
});