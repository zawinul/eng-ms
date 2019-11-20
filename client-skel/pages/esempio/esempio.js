(function(){
	var div;
	
	function activate(par) {
		div.appendTo('.engapp-page-container');
		engapp.setMenuActive('esempio');		
	}
		
	
	function deactivate() {
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.engapp-page-container');
		engapp.load(div, "pages/esempio/esempio.html").then(function(){
			callback();
		});
	}
	
	engapp.appPages.esempio = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	
})()