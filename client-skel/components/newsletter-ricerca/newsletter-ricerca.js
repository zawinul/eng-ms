(function(){
	var initialized = false;
	var wait = $.Deferred();
	var div;
	var query;

	// from http://emailregex.com/
	var mailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	function init() {
		if (initialized)
			return;
		div = $('<div/>').appendTo('body');
		vendite.load("components/newsletter-ricerca/newsletter-ricerca.css");
		vendite.load(div, "components/newsletter-ricerca/newsletter-ricerca.html").then(function(){
			$('.salva', div).click(salva);
			$('input', div).bind('click change keypress keyup', check);
			$('.ok-conferma', div).click(salva);
			wait.resolve();
			initialized = true;
		});
	}

	function salva() {
		var ok, msg;

		function eseguiSalvataggio() {
			var params = {
				ricerca: {
					mail: $('.mail', div).val(),
					query: query
				}
			};
			return vendite.ajax('newsletter/iscrizioneNewsletterRicerca', params)
			.then(function(response){
				ok = response.ok;
				msg = (ok) 
					? '<div class="save-ok"><p>Iscrizione avvenuta con successo<p>Un e-mail di conferma di sottoscrizione alla ricerca è stata inviata al Suo indirizzo di posta elettronica.<p>Lo staff</div>' 
					: 'A causa di un errore interno non &egrave; stato possibile procedere con l\'iscrizione'; 
			});
		}

		function mostraRisultato() {
			$('.salva-ricerca-modal', div).modal('hide')
			return	vendite.messageBox('Portale Vendite - Salvataggio Ricerca', msg); 
		}
		
		function fine() { 
			// se il salvataggio non ha successo faccio rivedere il modal
			// cosi l'utente può ritentare
			if (!ok) 
				$('.salva-ricerca-modal', div).modal('show')
		}

		eseguiSalvataggio().then(mostraRisultato).then(fine);
	}

	function check(evt) {

		$('.wrong', div).removeClass('wrong');
		var priv = $('.privacy:checked', div).length>0;
		$('.privacy', div).parent().toggleClass('wrong', !priv);

		var mail = $('.mail', div).val();
		var addrok =  mailRegExp.test(mail);
		//console.log("addr="+addr+" ok="+addrok);
		$('.mail', div).toggleClass('wrong', !addrok);

		if ($('.wrong', div).length>0)
			$('.salva', div).attr('disabled', 'disabled');
		else
			$('.salva', div).removeAttr('disabled');

		//console.log(formData);
	}


	vendite.salvaRicerca = function(_query)	{	
		query = _query;
		var d = $.Deferred();
		init();
		wait.then(function() {
			$('.salva-ricerca-modal', div).modal('show');
			check();
		});
		return d;
	}
})();