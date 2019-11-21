(function(){
	var content, base, currId;
	
	function activate(container, params) {
		currId = params.id-0;
		$('.item-id', content).text(currId);

		content.appendTo(container);
	}
		
	
	function deactivate(container, params) {
		content.detach();
	}
	
	function init(container, baseUrl) {
		base = baseUrl;
		content = $('<div/>').appendTo(container);
		engapp.load(base+"/style.css");
		return engapp.load(content, base+"/content.html").then(onLoad);
	}
	
	function onLoad() {
		$('.precedente').click(function(evt){
			evt.preventDefault();
			engapp.navigation.pushPage('esempio-dettaglio', { id: currId-1});
		});
		$('.successivo').click(function(evt){
			evt.preventDefault();
			engapp.navigation.pushPage('esempio-dettaglio', { id: currId+1});
		});
	}
	function getBreadcrumbLabel(params) {
		return "D-"+params.id;
	}

	engapp.navigation.registerPage({
		name: 'esempio-dettaglio',
		activate:activate,
		deactivate:deactivate,
		getBreadcrumbLabel: getBreadcrumbLabel,
		init:init
	});

})()