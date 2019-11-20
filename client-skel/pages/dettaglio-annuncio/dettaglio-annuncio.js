"use strict";
(function(){
	var div;
	var id;
	var annuncio;

	function activate(par) {
		id = par.id;
		$('.foto-album-div', div).remove();
		div.appendTo('.engapp-page-container');
		$('[data-annuncio], [data-immobile]', div).html('');
		engapp.ajax.getAnnuncio(id, onAnnuncio);
	}
		
	function deactivate() {
		div.detach();
	}
	
	function onAnnuncio(a) {
		annuncio = a;
		document.title = "Engapp - dettaglio "+a.codice;

		var imm = a.immobile;
		imm.indirizzoCalcolato = imm.indirizzoUfficio 
			? imm.indirizzoUfficio 
			: imm.indirizzoSede+'<br/>'+imm.capSede+' '+imm.sedeTerritoriale; 
		a.scadenzaGaraCalcolata = (a.scadenzaGara) 
			? engapp.util.stringToMoment(a.scadenzaGara).format('D MMMM YYYY')
			: ""; 
		$('[data-annuncio]', div).each(function(){
			var field = $(this).attr('data-annuncio');
			var v = render(field, annuncio[field]);
			$(this).html(v);
		});
		$('[data-immobile]', div).each(function(){
			var field = $(this).attr('data-immobile');
			var v = render(field, annuncio.immobile[field]);
			$(this).html(v);
		});

		$('[data-annuncio="prezzoBase"]').html(valutaInEuro(annuncio.prezzoBase));

		$('.link-brochure', div).attr('href', 'download?type=brochure&id='+annuncio.idBrochure).click(tracciaDownloadBrochure);
		
		var images = [];
		for(var i=0; i<annuncio.imgElenco.length; i++) {
			var name = (a.tipoAnnuncio=="LOCAZIONE")?"Affitto Immobile ":"Vendita Immobile ";
			name += a.comune+" "+a.codice+" "+(i+1);
			images.push({name:name, id:annuncio.imgElenco[i]});
		}
		engapp.getAlbumFoto(images, function(fotoAlbumDiv){
			fotoAlbumDiv.addClass('foto-album-div').appendTo($('.galleria', div));
		});
		
		//initMap(annuncio.coordinate);
		getCoordinate().then(initMap);
		
		socialLink();

		function tracciaDownloadBrochure() {
		}

	}

	function getCoordinate() {
		var d = $.Deferred();
		if (annuncio.coordinate) {
			d.resolve(annuncio.coordinate);
			return d;
		}
		var punto = annuncio.immobile.indirizzo+' - '+annuncio.comune;
		var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+escape(punto);
		$.getJSON(url).then(function(data){
			console.log(data);
			try {
				var lat = data.results[0].geometry.location.lat;
				var lng = data.results[0].geometry.location.lng;
				var adr = data.results[0].formatted_address;
				d.resolve(lat+','+lng, adr);
				console.log("formatted_address="+data.results[0].formatted_address);
			}catch(e) { d.resolve(null);}
		},function(){
			// error
			d.resolve(null);
		});
		return d;
	}
	function render(field, value) {
		if (value=='undefined' || value==null || value=='null') 
			return "";

		return value;
	}

	function init(callback) {
		div = $('<div/>').appendTo('.engapp-page-container');
		var toLoad = [
			"components/richiesta-info/richiesta-info.js",
			"pages/dettaglio-annuncio/dettaglio-annuncio.css",
			[div, "pages/dettaglio-annuncio/dettaglio-annuncio.html"]
		];

		engapp.load(toLoad).then(function() {
			$('.richiesta-info', div).click(function() {
				engapp.richiestaInfo(annuncio.id);
			});
		}).then(callback);
	}
	
	function googleWait(callback) {
		if (googleWait.loaded) {
			if (callback) callback();
			return;
		}
		$.getScript(lib, function() {
			googleWait.loaded = true;
			if (callback) callback();
		});
	}

	var googleLoaded = false, googleMap, googleMarker;
	function initMap(coordinate, label) {
		if (!coordinate)
			return $('.mappa', div).css({visibility:'hidden'});
		else
			$('.mappa', div).css({visibility:'visible'});

		if (label)
			$('.ingrandisci a').attr('href', 'https://maps.google.com/?q='+escape(label));
		else
			$('.ingrandisci a').attr('href', 'http://www.google.com/maps/place/'+coordinate);
		var x = coordinate.split(',');
		var pos = { lat: x[0]-0, lng: x[1]-0}

		if (googleLoaded)  {
			googleMap.setCenter(pos);
			googleMarker.setPosition(pos);
		}
		else {
			var lib="https://maps.googleapis.com/maps/api/js?key="+engapp.config.googleApiKey+'&language=it&region=IT';
			$.getScript(lib, function() {
				googleLoaded = true;
				googleMap = new google.maps.Map($('.mappa-container', div)[0], {
					zoom: 12,
					center: pos
				});
				googleMarker = new google.maps.Marker({
					position: pos,
					map: googleMap
				});
			});
		}
	}

	function socialLink() {
		var u = location.href;
		var tipoAnnuncio = annuncio.chiavi.isAffitti ? "affitto" : "vendita";
		var t = "FERSERVIZI - Annuncio "+tipoAnnuncio + " - "+annuncio.comune;
		var tags = "immobili;ferservizi";
		var ut = "https://twitter.com/intent/tweet?text="+escape(t)+"&url="+escape(u)+"&hashtags="+escape(tags);
		var uf = "https://www.facebook.com/sharer/sharer.php?u="+escape(u)+"&quote="+escape(t); 
		$('a.facebook', div).attr('href', uf);
		$('a.twitter', div).attr('href', ut);
	}	
	

	function valutaInEuro(n) {
		if (!n)
			return "";

		function punti(n) {
			if (n<1000)
				return ""+n;
			var left = punti(Math.floor(n/1000));
			var right = (""+(1000+n%1000)).substring(1);
			return left+'.'+right;
		}
		return "&euro; "+punti(n);
	}

	engapp.appPages.dettaglioAnnuncio = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}

})();

