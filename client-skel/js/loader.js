

var engapp = {
	clientver:'001',
	appPages: {} 
};

(function (){

var NOCACHE = true;
var verbose = false;

var initialLoad = [
	"img/loading.gif",
	"css/wait.css",
	"js/wait.js",

	"js/engapp-lib.js",

	"libs/ie10-viewport-bug-workaround.css",
	"libs/ie10-viewport-bug-workaround.js",
	"libs/bootstrap-toolkit.js",
	"js/responsive.js",
	
	"js/navigation.js",

	"css/main.css",
	
	"libs/moment.min.js",
	"libs/moment.locale.it.js",
	"libs/mousetrap.js",
	"libs/js.cookie.js",
	
	
	"components/footer/footer.js",
	"components/menu/menu.js",
	"components/box-ricerca/box-ricerca.js",
	"components/box-annuncio/box-annuncio.js",
	"components/box-annuncio/lista-annunci.js",
	"components/news-box/news-box.js",
	"components/breadcrumb/breadcrumb.js",
	"components/informativa-cookies/informativa-cookies.js",
	"components/header/header.js",
	"components/message-box/message-box.js"
];

engapp.caricaPagina = function(name) {
	return engapp.load('pages/'+name+'/'+name+'.js');
}


engapp.caricaComponente = function(name) {
	return engapp.load('components/'+name+'/'+name+'.js');
}


engapp.onStart = function(fun) {
	engapp.onStart.promise.then(fun);
}

function loaderInit() {
	// all'inizio nascondi tutto per evitare sfarfallamenti
	$('body').css({opacity:0});
	engapp.onStart.promise = loadAll();
	engapp.onStart(function(){
		engapp.home();
		$('body').animate({opacity:1}, 500);
	});

}


var resized = $.Deferred();
var resizeTimeout= null, resizeTime=500;
engapp.onResize = function(fun) {
	resized.progress(fun);
}

engapp.forceResize = function(delay) {
	delay = delay || 0;
	setTimeout(function(){
		$(window).trigger(resize);
		resized.notify();
	},delay)
}

$(window).resize(function(){
	
	if (resizeTimeout)
		clearTimeout(resizeTimeout);
	resizeTimeout=setTimeout(doIt, resizeTime);

	function doIt() {
		resized.notify();		
	}
});


function getUrlParams(url) {
	var params = {};
	url.substring(1).replace(/[?&]+([^=&]+)=([^&]*)/gi,
		function (str, key, value) { params[key] = value; });
	return params;
}

function initConfig() {
	var d = $.Deferred();
	engapp.ajax.getConfig().then(
		function(c) {
			engapp.config = c;
			d.resolve();
		}
	);
	return d;
}


function loadAll() {
	return loadMultiplo(initialLoad)
		.then(initConfig)
		//.then(engapp.ajax.getTerritorio())
		.then(function(){ 
			console.log(" === INITIAL LOAD COMPLETED === ");
			return true;
		});
}


var session = (new Date()).getTime();
function vurl(url) {
	if (!url.indexOf) {
		console.log(url);
	}
	if (NOCACHE) {
		if (url.indexOf('_nc=')>=0)
			return url;
		if (url.indexOf('?')>=0)
			return url+'&_nc='+session;
		else
			return url+'?_nc='+session;
	}
	else if (engapp.loadVersion) {
		if (url.indexOf('?')>=0)
			return url+'&_v='+engapp.loadVersion;
		else
			return url+'?_v='+engapp.loadVersion;
	}
}

function loadHtml(container, url) {
	var v = vurl(url);
	var d = $.Deferred();
	container.load(v, function(responseText, textStatus) {
		if (textStatus == "error" ) {
			alert('errore nel caricamento di '+url);
			return;
		}
		d.resolve();
	});
	return d;
}

function loadMultiplo(arr) {
	var cur = 0;
	var d = $.Deferred();
	function f() {
		if (verbose)
			console.log('loadMultiplo '+cur+' of '+arr.length);
		if (cur>=arr.length) {
			if (verbose)
				console.log('loadMultiplo RESOLVE');
			d.resolve();
			return;
		}

		var el = arr[cur++];
		if ($.isArray(el)) { 
			//  è un array contenente un elemento jQuery su cui 
			// caricare html e l'URL
			return loadHtml(el[0], el[1]).then(f);
		}
		else
			load(el).then(f);
	}
	f();
	return d;
}

function load(url) {
	if (typeof(url)=='object' && url.jquery) { 
		// il primo parametro è un elemento jQuery su cui caricare html
		return loadHtml.apply(this, arguments);
	}

	if ($.isArray(url))
		return loadMultiplo(url);

	var v = vurl(url);
	
	if (v.indexOf('.js?')>=0) 
		return loadJavascript(url);
	else if (v.indexOf('.css?')>=0)
		return loadCss(v);
	else if (v.indexOf('.png?')>=0 || v.indexOf('.jpg?')>=0 || v.indexOf('.jpeg?')>=0 || v.indexOf('.gif?')>=0)
		return loadImage(v);
	else if (v.indexOf('download')==0 && v.indexOf('type=image')>=0)
		return loadImage(v);
	else if (v.indexOf('gallery')==0)
		return loadImage(v);
	else {
		console.log('cannot load '+v);
		return $.when(1)
	}
}

var loaded = {};
function loadJavascript(url) {
	if (loaded[url]) { // i javascript si caricano una sola volta
		return loaded[url];
	}
	loaded[url] = jQuery.ajax({
		crossDomain: true,
		dataType: "script",
		url: url,
		//cache: false,
		success: function(){
			if (verbose)
				console.log('    loaded '+url);
		},
		error: function(){
			alert('errore nel caricamento di '+url);
		}
	});	
	return loaded[url];
}

function loadCss(url, immediate) {
	if (loaded[url])  // i css si caricano una sola volta
		return loaded[url];

	if (typeof(immediate)=='undefined') 
		immediate = true; // by defaault
	
	// if (verbose);
	// 	console.log('loadCss '+url+', immediate='+immediate);

	loaded[url] = $.Deferred();
	if (immediate) {
		$('<link/>').attr('href', url).attr('rel', 'stylesheet').appendTo('head');	
		loaded[url].resolve();	
	}
	else {
		$.get(url).then(function(){
			$('<link/>').attr('href', url).attr('rel', 'stylesheet').appendTo('head');	
			loaded[url].resolve();	
		}).fail(function(){
			alert("errore nel caricamento di "+v);
		});
	}
	return loaded[url];
}

function loadImage(url, immediate) {
	if (typeof(immediate)=='undefined') 
		immediate = false; // by defaault
		
	var d = $.Deferred();
	var img = new Image();
	img.onload = function () {
		if (!immediate) d.resolve(img);
	}
	img.src = url;
	if (immediate) d.resolve(img);
	return d;
}




engapp.load = load;
$(loaderInit);
	
})()