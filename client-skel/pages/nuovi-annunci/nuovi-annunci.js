(function(){
	var div, containerRicerca, containerNews, containerArticoli;
	var listaRisultati = null;

	function activate(par) {
		div.appendTo('.main-layout-body');		
		vendite.getBoxRicerca(function(box){
			containerRicerca.append(box);
		});

		vendite.setBoxNews(containerNews);
		vendite.setMenuActive('nuovi-annunci');
		listaRisultati = listaAnnunci(containerArticoli);
		listaRisultati.setFilter(function(element) {
			return element.isNovita;
		});
	}
		
	function deactivate() {
		listaRisultati.dispose();
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
		vendite.load("pages/nuovi-annunci/nuovi-annunci.css");
		vendite.load(div, "pages/nuovi-annunci/nuovi-annunci.html").then(function(){
			containerRicerca = $('.ricerca', div);
			containerArticoli = $('.annunci', div);
			containerNews = $('.news', div);
			callback();
		});
	}
	
	vendite.appPages.nuoviAnnunci = {
		activate:activate,
		deactivate:deactivate,
		init:init
	};

})()
