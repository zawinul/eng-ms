(function(){

var div, templateElemento, templateSeparatore;
var list = [];
var ready = $.Deferred();
window.debugBreadcrumb = list;


function draw() {
	ready.then(_draw);
}

function _draw() {
	// cancella elementi esistenti
	$('.elemento, .separatore', div).not('.home').remove();

	// ricrea nuovo elemento
	for(var i=0; i<list.length; i++) 
		add(i);

	// debug
	for(var i=0; i<list.length; i++) 
		console.log('BC'+i+': '+list[i].page+": "+list[i].url);


	function add(i) {
		// aggiungo un separatore
		templateSeparatore.clone().appendTo(div);
		var h = list[i];
		// aggiungo un link
		var el = templateElemento.clone().appendTo(div);
		$('.etichetta', el).text(h.page);
		$('a', el).attr('href', 'javascript:void(0)').click(function(evt) {
			console.log("breadCrumbEvent:i="+i+" href="+h.url);
			list.length = i;
			location.href = h.url;
		});		
	}
} 

function push(page, hash) {
	// compattazione breadcrumb
	// se non c'è almenu in elemento lo crea
	// se riconosco uno degli hash precedenti probabilmente è un "back" del browser
	if (list.length==0) {
		list.push({page:page, url: hash});
	}
	else {
		for(var i=list.length-1; i>=0; i--) {
			if (list[i].url == hash) {
				list.length = i;
				break;
			}
		}
		list.push({page:page, url: hash});
	}
}

function pop() {
	list.length = (list.length>0) ? list.length-1 : 0;
}

function clear() {
	list.length = 0;
}

function back() {
	if (list.length>0) {
		list.length = list.length-1;
		location.href = (list.length>0) ? list[list.length-1].url : "#";
	}
}

function create() {
	div = $('<div/>');
	ready = engapp.load(div, "components/breadcrumb/content.html").then(function(){
		templateElemento = $('.template.elemento', div).detach().removeClass('template');
		templateSeparatore = $('.template.separatore', div).detach().removeClass('template');
		engapp.components.breadcrumb.content = div;	
		return engapp.components.breadcrumb;
	});
	return ready;

}

engapp.load('components/breadcrumb/style.css');	

engapp.components.breadcrumb = {
	create: create,
	draw: draw,
	clear: clear,
	push:push,
	pop:pop,
	back:back
}

})();