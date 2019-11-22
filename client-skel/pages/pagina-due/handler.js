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
		return engapp.load(div, base+"/content.html").then(onPageLoad);
	}
	
	function onPageLoad() {
		$('.spazio-tabella', div).each(async function() {
			var tab = await engapp.creaComponente('tabella-finta', 9);
			$(this).append(tab.content);
		});

	}

	engapp.navigation.registerPage({
		name: 'pagina-due',
		activate:activate,
		deactivate:deactivate,
		init:init
	});

})()