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
		var trTemplate = $('tbody>tr', div).detach();
		for(var i=0; i<20; i++) {
			let tr = trTemplate.clone();
			let id = Math.floor(Math.random()*100000);
			let link = $('<a href="#">item '+id+'</a>').click(function(){
				alert(id);
			});
			$('td', tr).eq(0).append(link);
			$('td', tr).eq(1).text('AAA '+Math.random());
			$('td', tr).eq(2).text('BBB '+Math.random());
			$('tbody', div).append(tr);
		}
	}

	engapp.navigation.registerPage({
		name: 'pagina-due',
		activate:activate,
		deactivate:deactivate,
		init:init
	});

})()