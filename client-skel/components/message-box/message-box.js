(function _(){

var ui_ready = $.Deferred();	
var div;
var initialized = false;


function init() {
	if (initialized)
		return;

	div = $("<div/>").addClass("message-box");
	engapp.load("components/message-box/message-box.css");
	engapp.load(div, "components/message-box/message-box.html").then(onPageLoaded);
}

function onPageLoaded() {
	initialized = true;
	ui_ready.resolve();
}

engapp.messageBox = function(title, content) {
	var d = $.Deferred();

	function apri() {
		div.detach();
		$(".modal-title", div).html(title);
		if (typeof(content)=='string')
			$('.modal-body', div).html(content);
		else
			$('.modal-body', div).empty().append(content);
			
		$('.ok-button', div).bind('click', chiudi);

		$('body').append(div);
		$('.modal', div).modal('show');
	}

	function chiudi() {
		$('.ok-button', div).unbind('click', chiudi);
		$('.modal', div).modal('hide');
		d.resolve();
	}

	init();
	ui_ready.then(apri);
	return d;
}


})()

// ESEMPIO
// 	 engapp.caricaComponente('message-box')
// 	.then(function(){ return engapp.messageBox('Portale Vendite - Iscrizione Newsletter', 'Iscrizione avvenuta con successo'); })
// 	.then(function() { console.log('fatto'); });

