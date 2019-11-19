(function(){
	var initialized = false;
	var wait = $.Deferred();
	var esito;
	var div;
	var idAnnuncio;

	// from http://emailregex.com/
	var mailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	function init() {
		if (initialized)
			return;
		div = $('<div/>').appendTo('body');
		vendite.load("components/richiesta-info/richiesta-info.css");
		vendite.load(div, "components/richiesta-info/richiesta-info.html").then(function(){
			$('.salva', div).click(salva);
			$('.annulla', div).click(annulla);
			$('input', div).bind('click change keypress keyup', check);
			wait.resolve();
			initialized = true;
		});
	}
	function annulla() {
		$('.richiesta-info', div).modal('hide');
		esito.resolve(false);
	}
	
	function salva() {
		var ok, msg;

		function eseguiSalvataggio() {
			var params = {
				idAnnuncio: idAnnuncio,
				nome: $('.nome', div).val(),
				mail: $('.mail', div).val(),
				telefono: $('.telefono', div).val(),
				richiesta:  $('.richiesta', div).val(),
				urlAnnuncio:location.href
			};
			return vendite.ajax('annunci/richiestaInformazioni', params)
			.then(function(response){
				ok = response.ok;
				msg = (ok) 
					? '<div class="save-ok"><p>La richiesta di informazioni &egrave; stata registrata con successo<p>.<p>Lo staff</div>' 
					: 'A causa di un errore interno non &egrave; stato possibile procedere con la registrazione della sua richiesta'; 
			});
		}

		function mostraRisultato() {
			$('.richiesta-info', div).modal('hide');
			return	vendite.messageBox('Portale Vendite - Richiesta informazioni', msg); 
		}
		
		function fine() { 
			// se il salvataggio non ha successo faccio rivedere il modal
			// così l'utente può ritentare
			if (!ok) 
				$('.richiesta-info', div).modal('show');
			else
				esito.resolve(true);
		}

		eseguiSalvataggio().then(mostraRisultato).then(fine);
	}

	function check(evt) {

		$('.wrong', div).removeClass('wrong');
		var priv = $('.privacy:checked', div).length>0;
		$('.privacy', div).parent().toggleClass('wrong', !priv);

		var mail = $('.mail', div).val();
		var addrok =  mailRegExp.test(mail);
		$('.mail', div).toggleClass('wrong', !addrok);

		var nome = $('.nome', div).val();
		$('.nome', div).toggleClass('wrong', !nome);

		if ($('.wrong', div).length>0)
			$('.salva', div).attr('disabled', 'disabled');
		else
			$('.salva', div).removeAttr('disabled');

		//console.log(formData);
	}


	vendite.richiestaInfo = function(_idAnnuncio)	{	
		idAnnuncio = _idAnnuncio;
		esito = $.Deferred();
		init();
		wait.then(function() {
			$('.richiesta-info', div).modal('show');
			check();
		});
		return esito;
	}
})();

// esempio
function esempio() {

vendite.caricaComponente('richiesta-info')
.then(function(){ 
	console.log('fatto');
	vendite.richiestaInfo(123);
});

}