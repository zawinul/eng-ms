(function _(){

var ui_ready = $.Deferred();	
var template;
var initialized = false;


function init() {
	if (initialized)
		return;

	template = $("<div/>").addClass("message-box");
	engapp.load("components/message-box/style.css");
	initialized = true;
	ui_ready = engapp.load(template, "components/message-box/content.html").then(function(){
		initialized = true;
	});
}

function create(title, content) {
	var d = $.Deferred();
	var div; 

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
		return d;
	}

	function chiudi() {
		$('.ok-button', div).unbind('click', chiudi);
		$('.modal', div).modal('hide');
		d.resolve();
	}

	init();
	return 	ui_ready.then(function() {
		div = template.clone();
		return {
			content: div,
			open: apri,
			close: chiudi
		};
	});
}

init();

engapp.components['message-box'] = {
	create: create
};

})()

// ESEMPIO
function esempio() {
	engapp.creaComponente('message-box', 'Engapp - Iscrizione Newsletter', 'Iscrizione avvenuta con successo')
	.then(function(mb){
		mb.open().then(function(){alert('ok')});
	});
}

