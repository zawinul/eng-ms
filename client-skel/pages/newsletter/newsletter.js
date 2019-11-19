(function(){
	var div;
	var formData = {};

	// from http://emailregex.com/
	var mailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	function activate(par) {
		div.appendTo('.main-layout-body');
		vendite.setMenuActive('newsletter');
		check();
	}
		
	function check(evt) {

		$('.wrong', div).removeClass('wrong');
		var priv = $('.privacy:checked', div).length>0;
		$('.privacy', div).parent().toggleClass('wrong', !priv);

		formData.nome = $('.nome', div).val();
		formData.cognome = $('.cognome', div).val();
		$('.cognome', div).toggleClass('wrong', formData.cognome.trim().length==0);
		
		formData.mail = $('.mail', div).val();
		var addrok =  mailRegExp.test(formData.mail);
		//console.log("addr="+addr+" ok="+addrok);
		$('.mail', div).toggleClass('wrong', !addrok);

		if ($('.conduttore:checked', div).length==0) {
			$('.conduttore', div).closest('.da-validare').addClass('wrong');
			formData.operatore = false;
		}
		else {
			$('.conduttore', div).closest('.da-validare').removeClass('wrong');
			formData.operatore = $('.conduttore:checked', div).val()=='1';
		}

		formData.numContratto = $('.num-contratto', div).val();
		$('.num-contratto', div).toggleClass('wrong', formData.operatore && !formData.numContratto);
		
		formData.vendita = $('.vendita:checked', div).length>0;
		formData.locazione = $('.locazione:checked', div).length>0;

		if ($('.wrong', div).length>0)
			$('.sottoscrivi', div).attr('disabled', 'disabled');
		else
			$('.sottoscrivi', div).removeAttr('disabled');

		//console.log(formData);
	}
	function deactivate() {
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.main-layout-body');
		vendite.load("pages/newsletter/newsletter.css");
		vendite.load(div, "pages/newsletter/newsletter.html").then(function(){
			$('input', div).bind('click change keypress keyup', check);
			$('.sottoscrivi', div).click(sottoscrivi);

			callback();
		});

	}

	function sottoscrivi() {
		var ok, msg;

		function effettuaIscrizione() {
			var k =vendite.ajax('newsletter/iscrizioneNewsletterGenerica', {iscrizione:formData})
			.then(function(response) {
				ok = response.ok;
				msg = (ok) ? 'Iscrizione avvenuta con successo' : 'A causa di un errore interno non &egrave; stato possibile procedere con l\'iscrizione'; 
			});
			return k;
		}

		function mostraRisultato() {
			return	vendite.messageBox('Portale Vendite - Iscrizione Newsletter', msg); 
		}
		
		function fine() {
			if (ok)
				vendite.breadcrumb.back();
		}

		effettuaIscrizione().then(mostraRisultato).then(fine);
	}
	
	vendite.appPages.newsletter = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	
})()