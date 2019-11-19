(function(){
	var div, templateArticolo;
	
	function activate(par) {
		div.appendTo('.main-layout-body');
		vendite.setMenuActive('esempio');		
	}
		
	
	function deactivate() {
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
		vendite.load("pages/news/news.css");
		vendite.load(div, "pages/news/news.html").then(function(){
			templateArticolo = $('.articolo', div).detach(); 
			vendite.ajax.getNews(function(news) {
				var container = $('.contenitore-articoli', div);
				for (var i=0; i<news.length; i++) {
					var articolo = news[i];
					var d = templateArticolo.clone().appendTo(container);
					var m = vendite.util.stringToMoment(articolo.dataIns); 
					$('.data',d).text(m.format("D MMMM YYYY"));
					$('.titolo', d).text(articolo.titolo);
					$('.contenuto', d).text(articolo.descrizione);
				}
				callback();
			});
		});
	}
	
	vendite.appPages.news = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	
})()