(function(){
	var div, containerRicerca, containerNews, containerArticoli;
	var listaRisultati = null;


	function activate(par) {
		div.appendTo('.main-layout-body');		
		vendite.getBoxRicerca(function(box){
			containerRicerca.append(box);
		});
		vendite.setBoxNews(containerNews);
		var titolo = (par.type=='vendite') ?'Vendite':'Affitti';
		titolo+=" in scadenza al "+vendite.util.stringToMoment(par.scadenza).format("D MMMM YYYY");
		$('.intestazione', div).text(titolo);
		listaRisultati = listaAnnunci(containerArticoli);
		
		listaRisultati.setFilter(function(element) {
			if (!element.isNovita)
				return false;
			if (par.type=='affitti' && !element.isAffitti)
				return false;
			if (par.type=='vendite' && !element.isVendite)
				return false;

			return element.dataGara == par.scadenza;
		});
	}
		
	function deactivate() {
		listaRisultati.dispose();
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
		vendite.load("pages/in-scadenza/in-scadenza.css");
		vendite.load(div, "pages/in-scadenza/in-scadenza.html").then(function(){
			containerRicerca = $('.ricerca', div);
			containerArticoli = $('.annunci', div);
			containerNews = $('.news', div);
			callback();
		});
	}
	
	
	vendite.appPages.inScadenza = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	
})()