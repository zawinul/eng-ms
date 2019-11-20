(function(){
	var div;
	var id, caller;
	var containerRicerca, containerRisultati;
	var listaRisultati = null;
	var chiaviDiRicerca;
	var boxRicerca;
	var criteri;
	var mappaComuni = {};
	var datiPresenti;

	function activate(par) {

		id = par.id;
		caller = par.caller;
		div.appendTo('.engapp-page-container');
		engapp.getBoxRicerca(function(box) {
			boxRicerca = box;
			$('.criteri', div).append(boxRicerca);
			boxRicerca.bind('criteri-cambiati', refresh);
			listaRisultati = listaAnnunci(containerRisultati);
			refresh();
		});
	}
		
	function deactivate() {
		if (listaRisultati)
			listaRisultati.dispose();
		boxRicerca.unbind('criteri-cambiati', refresh);

		div.detach();
	}
	
	function refresh() {
		console.log("ricerca: refresh");
		var result = [];
		datiPresenti.then(function(){
			console.log("ricerca: refresh: dati presenti");
			criteri = boxRicerca.getCriteri();
			console.log({raCriteri: criteri });
			listaRisultati.setFilter(function(element) {
				return matchCriteri(element, criteri);
			});
			var cnt = 0;
			for(var i=0;i<chiaviDiRicerca.length; i++) {
				if (matchCriteri(chiaviDiRicerca[i], criteri))
					cnt++
			}
			boxRicerca.setNumRisultati(cnt);
			//listaRisultati.setData(result);
			if (cnt>0)
				$('.no-result', div).hide();
			else
				$('.no-result', div).show();
			engapp.changeHash('ricerca-avanzata', criteri);
		});
	}

	function matchCriteri(elemento, criteri) {
		var ven=criteri.vendite, aff=criteri.affitti, vet=criteri.vetrina, nov=criteri.novita;
		if (!ven && !aff && !vet && !nov)
			ven = aff = vet = aff = true;

		var ok = false;
		if (ven && elemento.isVendite) ok=true;
		if (aff && elemento.isAffitti) ok=true;
		if (nov && elemento.isNovita) ok=true;
		if (vet && elemento.isVetrina) ok=true;
		if (!ok)
			return false;

		var comune = elemento.idComune;
		var m = mappaComuni[comune];
		if (!m) {// non dovrebbe succedere in esercizio
			//alert('no map for '+comune);
			return false;
		}
		if (criteri.regione!='')
			if (m.reg!=criteri.regione)
				return false;
		if (criteri.provincia!='')
			if (m.prov!=criteri.provincia)
				return false;
		if (criteri.comune!='')
			if (comune!=criteri.comune)
				return false;
		
		if (criteri.fascia && !elemento.isAffitti) { // per fascia si intende quella relativa alle vendite
			var fp = searchId(engapp.config.fascePrezzo, criteri.fascia);
			if (fp) {
				if (elemento.prezzo < fp.min)
					return false;
				if (elemento.prezzo > fp.max)
					return false;
			}
		}

		
		if (criteri.canone && elemento.isAffitti) { // per canone si intende la fascia affitti
			var fp = searchId(engapp.config.fasceCanone, criteri.canone);
			if (fp) {
				if (elemento.prezzo < fp.min)
					return false;
				if (elemento.prezzo > fp.max)
					return false;
			}
		}

		if (criteri.mq) {
			var fp = searchId(engapp.config.fasceMetriQuadri, criteri.mq);
			if (fp) {
				if (elemento.mq < fp.min)
					return false;
				if (elemento.mq > fp.max)
					return false;
			}
		}

		if (criteri.tipo && (criteri.tipo!=elemento.tipoImmobile))
			return false;
			
		return true;
	}

	function searchId(arr, id) {
		for(var i=0;i<arr.length;i++)
			if (arr[i].id==id)
				return arr[i];
		return null;
	}

	function init(callback) {
		datiPresenti = initMappaComuni().then(getChiaviDiRicerca);
		datiPresenti.then(function() { console.log("DATI PRESENTI");})
		div = $('<div/>').appendTo('.engapp-page-container');
		var toLoad = [
			"pages/ricerca-avanzata/ricerca-avanzata.css",
			[div, "pages/ricerca-avanzata/ricerca-avanzata.html"]
		];
		engapp.load(toLoad).then(function(){
			$('.no-result', div).hide();
			containerRicerca = $('.criteri', div);
			containerRisultati = $('.risultati', div);
			if (callback)
				callback();
		});
	}


	function initMappaComuni() {
		function buildMap(t) {
			console.log('build map');
			for(var i=0; i<t.regioni.length;i++) {
				var reg = t.regioni[i];
				for( var j=0; j<reg.province.length; j++) {
					var prov = reg.province[j];
					for(var k=0; k<prov.comuni.length;k++) {
						var com = prov.comuni[k];
						mappaComuni[com.id] = { prov: prov.id, reg:reg.id}
					}
				}
			}
		}
		return engapp.ajax.getTerritorio().then(buildMap);
	}

	function getChiaviDiRicerca() {
		return engapp.ajax.getChiaviDiRicerca().then(function(x) {
			chiaviDiRicerca = x;
		});
	}

	engapp.appPages.ricercaAvanzata = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	


})()