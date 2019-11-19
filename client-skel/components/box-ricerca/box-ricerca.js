(function _(){

var ui_ready = $.Deferred();	
var data_ready = $.Deferred();	
var div;
var regione, provincia, comune;
var regselect, provselect, comselect;
var territorio;
var initialized = false;
var updating = false;


function init() {
	if (initialized)
		return;

	div = $("<div/>").addClass("vendite-ricerca");
	engapp.load("components/box-ricerca/box-ricerca.css");
	engapp.load(div, "components/box-ricerca/box-ricerca.html").then(onPageLoaded);
}

var updateTimeout= null, updateTime=50;

function onValueChange() {
	console.log('on value change');
	$('.salva-ricerca', div).attr('disabled', 'disabled');
	$('select', div).each(function(){
		var valorizzato = $(this).val()!="";
		$(this).toggleClass('valorizzato', valorizzato);
		if (valorizzato)
			$('.salva-ricerca', div).removeAttr('disabled');
	});

	if (updateTimeout)
		clearTimeout(updateTimeout);
	updateTimeout=setTimeout(doIt, updateTime);

	function doIt() {
		console.log('criteri-cambiati');
		div.trigger('criteri-cambiati');
	}
}

function onPageLoaded() {
	$('.pannello-criteri select, .pannello-criteri input', div).bind('change', onValueChange);
	$('.pannello-criteri input[typr="checkbox"]', div).bind('click', onValueChange);

	regselect = $('.regione', div);
	provselect = $('.provincia', div);
	comselect = $('.comune', div);

	engapp.ajax.getTerritorio().then(function(t){
		territorio = t;
		for(var i=0;i<territorio.regioni.length; i++) {
			var reg = territorio.regioni[i];
			$('<option/>').val(reg.id).addClass('dyn fg-verde').text(reg.name).appendTo(regselect);
		}
		regselect.change(cambioRegione);
		provselect.change(cambioProvincia);
		data_ready.resolve();
	});

	$('.salva-ricerca', div).click(function(){
		//$('.salva-ricerca-modal', div).modal('show');
		var query = (location.href.indexOf('?')>=0)
			? location.href.substring(location.href.indexOf('?')+1)
			: "";
		engapp.caricaComponente("newsletter-ricerca").then(function(){
			engapp.salvaRicerca(query);
		});
	})

	$('.cerca', div).click(function(){
		if (engapp.currPage=='ricerca-avanzata')
			engapp.substPage('ricerca-avanzata', getParametri());
		else
			engapp.pushPage('ricerca-avanzata', getParametri());
	});

	for(var i=0; i<engapp.config.fascePrezzo.length; i++) {
		var e = engapp.config.fascePrezzo[i];
		$('<option/>').appendTo($('select.fascia-prezzo', div)).addClass('dyn').val(e.id).html(e.label);
	}

	for(var i=0; i<engapp.config.fasceCanone.length; i++) {
		var e = engapp.config.fasceCanone[i];
		$('<option/>').appendTo($('select.fascia-canone', div)).addClass('dyn').val(e.id).html(e.label);
	}

	for(var i=0; i<engapp.config.fasceMetriQuadri.length; i++) {
		var e = engapp.config.fasceMetriQuadri[i];
		$('<option/>').appendTo($('select.fascia-metri-quadri', div)).addClass('dyn').val(e.id).html(e.label);
	}

	for(var i=0; i<engapp.config.tipiImmobile.length; i++) {
		var e = engapp.config.tipiImmobile[i];
		$('<option/>').appendTo($('select.tipo-immobile', div)).addClass('dyn').val(e.id).html(e.label);
	}

	div.getCriteri = getCriteri;
	div.setNumRisultati = setNumRisultati;

	setTimeout(caricaMappa, 1000);
	initialized = true;
	ui_ready.resolve();
}

function caricaMappa() {
	var mapc = $('.mappa-italia-container', div);
	engapp.load("components/box-ricerca/mappa-italia.js").then(function(){
		engapp.getMappaItalia(mapc, onIdChanged);
	});

	function onIdChanged(id) {
		regselect.val(id);
		regselect.trigger('change');		
	}
}

function setNumRisultati(n) {
	if (n==0)
		$('.num-risultati', div).text('La ricerca non ha prodotto risultati');
	else
		$('.num-risultati', div).text('La ricerca ha prodotto '+n+' risultati');
}

function getCriteri() {
	return {
		regione: regselect.val(),
		provincia: provselect.val(),
		comune: comselect.val(),
		fascia: $('.fascia-prezzo', div).val(),
		canone: $('.fascia-canone', div).val(),
		tipo: $('.tipo-immobile', div).val(),
		vendite: $('.check-vendite:checked', div).length>0,
		affitti: $('.check-affitti:checked', div).length>0,
		novita: $('.check-novita:checked', div).length>0,
		vetrina: $('.check-vetrina:checked', div).length>0,
		mq:  $('.fascia-metri-quadri', div).val()
	}
}


function cambioRegione() {
	$('.dyn', provselect).remove();
	provselect.val("");
	$('.dyn', comselect).remove();
	comselect.val("");
	var v = regselect.val();
	if (v!="") {
		regione = null;
		for (var i=0;i<territorio.regioni.length; i++)
			if (territorio.regioni[i].id == v)
				regione = territorio.regioni[i];

		if (regione) {
			for(var i=0; i<regione.province.length; i++) {
				var prov = regione.province[i];
				$('<option/>').val(prov.id).addClass('dyn fg-verde').text(prov.name).appendTo(provselect);
			}
		}
	}
	provselect.trigger('change');
	comselect.trigger('change');
}


function cambioProvincia() {
	$('.dyn', comselect).remove();
	comselect.val("");
	var v = provselect.val();
	if (v!="") {
		provincia = null;
		for (var i=0;i<regione.province.length; i++)
			if (regione.province[i].id == v)
				provincia = regione.province[i];
		console.log({provincia:provincia});
		if (provincia) {
			for(var i=0; i<provincia.comuni.length; i++) {
				var com = provincia.comuni[i];
				$('<option/>').val(com.id).addClass('dyn fg-verde').text(com.name).appendTo(comselect);
			}
		}
	}
	comselect.trigger('change');
}

function aggiornaQuery() {
	$('.regione,.provincia,.comune,.tipo-immobile,.fascia-prezzo,.fascia-canone,.fascia-mq', div).val('');
	$('input[type="checkbox"]', div).removeAttr('checked');
	var p = engapp.queryParams || {};
	$('.regione', div).val((p.regione)?p.regione:"").trigger('change');
	setTimeout(function(){
		$('.provincia', div).val((p.provincia)?p.provincia:"").trigger('change');
		setTimeout(function(){
			$('.comune', div).val((p.comune)?p.comune:"").trigger('change');
			onValueChange();
		},10);
	},10);

	$('.tipo-immobile', div).val((p.tipo)?p.tipo:"");
	$('.fascia-prezzo', div).val((p.fascia)?p.fascia:"");
	$('.fascia-canone', div).val((p.canone)?p.canone:"");
	$('.fascia-mq', div).val((p.mq)?p.mq:"");

	if (p.vendite) 
		$('.check-vendite', div).attr('checked', 'checked');
	if (p.affitti) 
		$('.check-affitti', div).attr('checked', 'checked');
	if (p.novita) 
		$('.check-novita', div).attr('checked', 'checked');
	if (p.vetrina) 
		$('.check-vetrina', div).attr('checked', 'checked');
	//$('.regione,.provincia,.comune,.tipo-immobile,.fascia-prezzo', div).trigger('change');
	onValueChange();
}


function getParametri() {
	var p = {};
	function f(sel, field) {
		var v = $(sel, div).val();
		if (v!="")
			p[field] = v;
	}
	f('.regione', 'regione');
	f('.provincia','provincia');
	f('.comune', 'comune');
	f('.tipo-immobile','tipo');
	f('.fascia-prezzo','fascia');
	f('.fascia-canone','canone');
	return p;
}


engapp.getBoxRicerca = function(callback) {
	init();

	ui_ready.then(function(){
		console.log('ui_done');
		div.detach();
		data_ready.then(aggiornaQuery);
		callback(div);
	});
}


})()


 