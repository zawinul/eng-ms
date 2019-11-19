(function(){
	var div;
	
	function activate(par) {
		div.appendTo('.main-layout-body');
		engapp.setMenuActive('esempio');		
	}
		
	
	function deactivate() {
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
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