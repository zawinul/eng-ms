(function(){
	var div, containerRicerca, containerNews;
	
	function activate(par) {
		div.appendTo('.main-layout-body');		
		engapp.getBoxRicerca(function(box){
			containerRicerca.append(box);
		});
		engapp.setBoxNews(containerNews);
		setTimeout(function(){
			$('.jumbotron').collapse('show');
		},3000)
		setTimeout(function(){
			$('.jumbotron').collapse('hide');
		},10000)
	}
		
	
	function deactivate() {
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
		engapp.load("pages/home/home.css");
		engapp.load(div, "pages/home/home.html").then(function(){
			containerRicerca = $('.ricerca', div);
			containerNews = $('.news', div);
			for(var i=0;i<3;i++) {
				engapp.getBoxAnnuncio(i, function(obj){
					obj.appendTo($('.annunci-vendita', div));
					obj.addClass((i%2==0)?'even':'odd');
				});
			}
			for(var i=0;i<4;i++) {
				engapp.getBoxAnnuncio(0, function(obj){
					obj.appendTo($('.annunci-primo-piano', div));
					obj.addClass((i%2==0)?'even':'odd');
				});
			}
			callback();
		});
	}
	
	
	engapp.appPages.home = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	


})()