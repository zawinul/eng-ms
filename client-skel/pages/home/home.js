(function(){
	var div;
	
	function activate(container, params) {
		div.appendTo(container);		
		setTimeout(function(){
			$('.jumbotron', div).collapse('hide');
		},10000)
	}
		
	
	function deactivate(container, params) {
		div.detach();
	}
	
	function init(container) {
		div = $('<div/>').appendTo(container);
		engapp.load("pages/home/home.css");
		return engapp.load(div, "pages/home/home.html");
	}
	
	
	engapp.appPages.home = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	


})()