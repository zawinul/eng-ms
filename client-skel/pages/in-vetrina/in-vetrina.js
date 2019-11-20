(function(){
	var div, containerRicerca, containerNews, containerArticoli;
	var listaRisultati = null;

	var isMain;
	function activate(par) {
		isMain = !!par.isMain;
		$('body').toggleClass('is-main', isMain);
		div.appendTo('.engapp-page-container');		
		engapp.getBoxRicerca(function(box){
			console.log('invetrina, obtained box ricerca');
			containerRicerca.append(box);
		});

		engapp.setBoxNews(containerNews);
		if (!isMain) 
			engapp.setMenuActive('in-vetrina');
		
		listaRisultati = listaAnnunci(containerArticoli);
		listaRisultati.setFilter(function(element) {
			return element.isVetrina;
		});
	}
		
	function deactivate() {
		listaRisultati.dispose();

		div.detach();
		$('body').removeClass('is-main');
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.engapp-page-container');
		engapp.load("pages/in-vetrina/in-vetrina.css");
		engapp.load(div, "pages/in-vetrina/in-vetrina.html").then(function(){
			console.log('in-vetrina loaded');
			containerRicerca = $('.ricerca', div);
			containerArticoli = $('.annunci', div);
			containerNews = $('.news', div);
			callback();
		});
	}
	
	engapp.appPages.inVetrina = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}

})();
