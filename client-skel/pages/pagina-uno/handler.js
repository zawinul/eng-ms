(function(){
	var div, base;
	
	function activate(container, params) {
		div.appendTo(container);
	}
		
	
	function deactivate(container, params) {
		div.detach();
	}
	
	function init(container, baseUrl) {
		base = baseUrl;
		div = $('<div/>').appendTo(container);
		engapp.load(base+"/style.css");
		return engapp.load(div, base+"/content.html");
	}
	
	engapp.navigation.registerPage({
		name: 'pagina-uno',
		activate:activate,
		deactivate:deactivate,
		init:init
	});

})()