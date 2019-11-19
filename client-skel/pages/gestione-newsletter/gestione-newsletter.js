(function(){
	var div;

	function activate(par) {
		div.appendTo('.main-layout-body');
		var container = $('.messaggio', div);
		container.empty();
		div.css({visibility:'hidden'});
		vendite.ajax('newsletter/gestioneIscrizioni', par, function(response){
			var msg;
			var isConferma = par.op.indexOf('confirm')>=0;
			var isRicerca = par.op.indexOf('ricerca')>=0;
			var e =response.esito;
			
			if (e=='OK') {
				msg = isConferma ? 'confermata' : 'cancellata';
				msg = "Gentile cliente,\nla sua iscrizione alla newsletter è stata "+msg+" con successo.\nGrazie\n\nLo Staff";
			}
			else if (e=='WRONGOP' || e=='NO_KEY' || e=='DB_ERROR') {
				msg = isConferma ? 'conferma' : 'cancellazione';
				"Gentile cliente,\na casua di un errore non è stato possibile procedere con la "+msg+".\nGrazie\n\nLo Staff";
			}
			else if (e=='NO_CHANGE') {
				if (isConferma)
					msg =  "CONFERMA ISCRIZIONE NON AVVENUTA\n\nIl tempo a sua disposizione per confermare l’ iscrizione alla newsletter è scaduto.\nLa preghiamo di rieseguire la procedura di iscrizione.";
				else
					msg = "CANCELLAZIONE NON AVVENUTA\n\nLa cancellazione della sottoscrizione potrebbe essere già stata effettuata in precedenza.";
			}
			msg = msg.split('\n');
			for(var i=0; i<msg.length; i++)
				$('<div/>').html(msg[i]).appendTo(container);
			div.css({visibility:'visible'});
		})
	}
		
	function esegui(par) {
		var esito, msg;
		var isConferma = par.op.indexOf('confirm')>=0;
		var isRicerca = par.op.indexOf('ricerca')>=0;
		var callServer= vendite.ajax('newsletter/gestioneIscrizioni', par).then(function(response){
			esito = response.esito;
		});
		var k = callServer.then(function() {
			if (esito=='OK') {
				msg = isConferma ? 'confermata' : 'cancellata';
				msg = "Gentile cliente,\nla sua iscrizione alla newsletter è stata "+msg+" con successo.\nGrazie\n\nLo Staff";
			}
			else if (esito=='WRONGOP' || esito=='NO_KEY' || esito=='DB_ERROR') {
				msg = isConferma ? 'conferma' : 'cancellazione';
				msg = "Gentile cliente,\na casua di un errore non è stato possibile procedere con la "+msg+".\nGrazie\n\nLo Staff";
			}
			else if (esito=='NO_CHANGE') {
				if (isConfirm)
					msg =  "CONFERMA ISCRIZIONE NON AVVENUTA\n\nIl tempo a sua disposizione per confermare l’ iscrizione alla newsletter è scaduto.\nLa preghiamo di rieseguire la procedura di iscrizione.";
				else
					msg = "CANCELLAZIONE NON AVVENUTA\n\nLa cancellazione della sottoscrizione potrebbe essere già stata effettuata in precedenza.";
			}
			msg = msg.split('\n');
			for(var i=0; i<msg.length; i++)
				$('<div/>').html(msg[i]).appendTo(container);
		});
		return k;
	}

	function deactivate() {
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>');
		vendite.load("pages/gestione-newsletter/gestione-newsletter.css");
		vendite.load(div, "pages/gestione-newsletter/gestione-newsletter.html").then(function(){
			$('.ok-button', div).click(function(){
				location.href = '#';
			});	
			callback();
		});
	}
	

	vendite.appPages.gestioneNewsletter = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	
})()