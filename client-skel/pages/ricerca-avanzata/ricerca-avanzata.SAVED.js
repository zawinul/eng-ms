(function(){
	var div;
	var id, caller;
	var containerRicerca, containerRisultati;
	var resultSet = [], visibleElements, lastElement;

	function activate(par) {
		id = par.id;
		caller = par.caller;
		div.appendTo('.main-layout-body');
		vendite.setBoxRicerca($('.criteri'), 'in-vetrina');
		refresh();
	}
		
	function onScroll() {
		docheck();
	}

	function docheck() {
		setTimeout(checkLastElementVisibility,1);
	}

	function checkLastElementVisibility() {
		console.log('checkLastElementVisibility');
		if (!resultSet || visibleElements>=resultSet.length)
			return;
		var ok = true;
		if (lastElement) {
			var offs = lastElement.offset().top;
			var scrolly = $(document).scrollTop().valueOf();
			console.log('offs='+offs+' scrolly='+scrolly);
			if (offs>scrolly+$(window).height())
				ok = false;
		} 
		else {
			console.log('lastElement not present');
		}
		console.log('checkLastElementVisibility -> '+ok);
		
		if (ok) {
			var box = $('<div/>').appendTo(containerRisultati);
			var id = resultSet[visibleElements];
			visibleElements++;
			vendite.getBoxAnnuncio(id, function(obj){
				lastElement = obj;
				obj.addClass('annuncio risultato-ricerca');
				box.append(obj);
				docheck();
			});
		}
	} 

	function deactivate() {
		$('.risultato-ricerca', div).remove();
		$('.annuncio', div).remove();
		$('.vendite-ricerca', div).removeClass('con-risultati');

		div.detach();
	}
	
	function getRisultati() {
		// todo: sostituire con la chiamata alla ricerca
		vendite.ajax("annunci/getAnnunciInVetrina", {}, function(response){
			//for(var i=0; i<response.articoli.length; i++)
			resultSet.length = 0;
			for(var i=0; i<100; i++)
				resultSet.push(Math.floor(Math.random()*10000));
			lastElement = null;
			visibleElements = 0;
			$('.annuncio', div).remove();
			docheck();
		});

		// function add(id) {
		// 	var box = $('<div/>').appendTo(containerRisultati);
		// 	vendite.getBoxAnnuncio(id, function(obj){
		// 		obj.addClass('annuncio');
		// 		box.append(obj);
		// 	});
		// }
	}

	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
		var toLoad = [
			"pages/ricerca-avanzata/ricerca-avanzata.css",
			[div, "pages/ricerca-avanzata/ricerca-avanzata.html"]
		];
		vendite.load(toLoad).then(function(){
			containerRicerca = $('.criteri', div);
			//alert(containerRicerca.length);

			containerRisultati = $('.risultati', div);

			if (callback)
				callback();
		});

		$(window).scroll(onScroll);
	}
	
	
	vendite.appPages.ricercaAvanzata = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	


})()