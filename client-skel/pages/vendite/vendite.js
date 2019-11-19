(function(){
	var div, containerRicerca, containerNews, containerArticoli;
	var listaRisultati = null;

	function activate(par) {
		div.appendTo('.main-layout-body');		
		engapp.getBoxRicerca(function(box){
			containerRicerca.append(box);
		});
		engapp.setBoxNews(containerNews);
		engapp.setMenuActive('vendite');
		listaRisultati = listaAnnunci(containerArticoli);
		listaRisultati.setFilter(function(element) {
			return element.isVendite;
		});
	}
		
	function deactivate() {
		listaRisultati.dispose();
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
		engapp.load("pages/vendite/engapp.css");
		engapp.load(div, "pages/vendite/engapp.html").then(function(){
			containerRicerca = $('.ricerca', div);
			containerArticoli = $('.annunci', div);
			containerNews = $('.news', div);
			callback();
		});
	}
	
	engapp.appPages.vendite = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	
})();