(function(){


var initialized=false;
var templatePromise;

function init() {
	engapp.load("components/tabella-finta/style.css");
	initialized = true;
	var div = $('<div/>');
	templatePromise = engapp.load(div, 'components/tabella-finta/content.html').then(function(){
		return div.children();
	});
}

function create(n) {
	if (typeof(n)=='undefined')
		n=10;

	if (!initialized)
		init();

	return templatePromise.then(function(template) {
		var element = template.clone();
		var trTemplate = $('tbody>tr', element).detach();
		for(var i=0; i<n; i++) {
			let tr = trTemplate.clone();
			let id = Math.floor(Math.random()*100000);
			let link = $('<a href="#">item '+id+'</a>').click(function(evt){
				evt.preventDefault();
				engapp.navigation.pushPage('esempio-dettaglio', {id:id});
			});
			$('td', tr).eq(0).append(link);
			$('td', tr).eq(1).text('AAA '+Math.random());
			$('td', tr).eq(2).text('BBB '+Math.random());
			$('tbody', element).append(tr);
		}
		return {
			content: element
		}
	});
}


engapp.components['tabella-finta'] = {
	create: create
};


	
})();


 