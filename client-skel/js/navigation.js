(function _navigation() {


var curr;
var ignoraHashChange = false;
var container;

// questa funzione viene chiamata automaticamente dal browser ad ogni cambio indirizzo
window.onhashchange = function(evt) {
	console.log("ONHASHCHANGE "+location.href);
	if (ignoraHashChange) {
		ignoraHashChange = false;
		console.log("hashchange ignorato");
	}
	else 
		parseAddress();
}


function init() {
	container = engapp.pageContainer = $('.engapp-page-container');

}


function main() {
	engapp.caricaComponente('breadcrumb').then(function(){
		engapp.components.breadcrumb.clear();
	});
	localOpenPage('home', {isMain:true});	
}

function parseAddress() {
	console.log("parseAddress: "+location.href);
	// hashAndQuery = url dal # in poi
	var hashAndQuery = location.href.split('#')[1];
	if (!hashAndQuery) 
		return main();
	

	var page = unescape(hashAndQuery.split('?')[0]);
	var query = hashAndQuery.split('?')[1];

	if (page.substring(0,1)=="/")
		page = page.substring(1);
	if (page=="")
		return main();

	console.log('next page is '+page);
	var params = {};
	query = query ? query.split("&") : [];
	for(var i=0;i<query.length; i++) {
		var par = query[i].split('=');
		var key = par[0];
		var value = par[1];
		params[unescape(key)] = unescape(value);
	}
	
	engapp.status.queryParams = params;

	// aggiungo lo stato corrente al breadcrumb
	engapp.caricaComponente('breadcrumb').then(function(){
		engapp.components.breadcrumb.push(page, hashAndQuery);
	});

	// aggiorno la UI
	localOpenPage(page, params);	
}

function gotoPage(name, params) {
	console.log('goto '+name);
	engapp.components.breadcrumb.clear();
	pushPage(name, params);
}


function substPage(name, params) {
	console.log('subst '+name);
	engapp.components.breadcrumb.pop();
	pushPage(name, params);
}

// cambia l'hash sulla barra indirizzi senza causare un refresh
function changeHash(name, params) {
	var adr = name;
	params = params || {};
	var arr = [];
	for(var k in params)
		if (params[k])
			arr.push(escape(k)+"="+escape(params[k]));
	engapp.status.currHash = "";
	if (arr.length>0) {
		engapp.status.currHash = arr.join('&');
		adr += "?" + engapp.status.currHash;
	}
	curr = name;
	if (window.location.hash != '#'+adr) {
		console.log("changeHash: ignoraHashChange=true, hash="+adr+' (was '+window.location.hash+')');
		ignoraHashChange = true;
		window.location.hash = adr;
	}
}

function pushPage(name, params) {
	
	console.log('push '+name);
	var adr = "#/"+escape(name);
	params = params || {};
	var arr = [];
	for(var k in params)
		if (params[k])
			arr.push(escape(k)+"="+escape(params[k]));
	if (arr.length>0)
		adr += "?"+arr.join('&');

	curr = name;

	// JUMP!
	location.href=adr;
}

function localOpenPage(name, params) {
	var next = engapp.appPages[name];
	if (!next) {
		// la pagina 'name' non è mai stata caricata in precedenza, caricala e ripeti l'operazione
		caricaPagina(name).then(function(){
			localOpenPage(name, params);
		});
		return;
	}

	//engapp.setMenuActive(null);
	
	
	params = params || {};
	console.log('jumping to ' + name + ' '+!!next);
	$('body').waitStart();

	// usciamo dalla pagina di provenienza
	var prev = (engapp.status.currPage) 
		? engapp.appPages[engapp.status.currPage] 
		: null;
	if (prev) {
		var k = prev.deactivate(container, params);
		if (typeof(k)=='undefined')
			return go();
		else if (!k) 
			return abortJump(); 
		else 
			when(k).then(go, abortJump);
	}
	else
		go(true);
	
	function abortJump() {
		$('body').waitStop();
	}
	function go() { // salta alla pagina target
		$('body').waitStop();
		engapp.status.currPage = name;
		document.title = "ENGAPP - "+name.replace('-', ' ');
		var initVal = next._initialized || next.init(container, 'pages/'+escape(name));
		var p = $.when(initVal)
			.then(function(){ 
				next._initialized=true
			})
			.then(start)
			.catch(function(){
				alert('non è stato possibile inizializzare ['+name+']');
			});
		return p;
	}
	
	function start() {
		console.log({ openPage:name, params:params});
		next.activate(container, params); 
		engapp.components.breadcrumb.draw();
	}
}


function caricaPagina(name) {
	var p = engapp.load('pages/'+escape(name)+'/handler.js')
		.catch(function(){ 
			registerPage({name: name}); 
			return true;}
		);
	return p;
}

function setDefaultPageHandler(name) {

}

function susbstPage(name, params) {

}

function registerPage(cfg) {
	var base, div;

	var defaultConfig = {
		name: 'default',
		activate:function(){
			div.appendTo(container);		
		},

		deactivate:function(){
			div.detach();
		},

		init:function(container, baseUrl) {
			base = baseUrl;
			div = $('<div/>').appendTo(container);
			engapp.load(base+"/style.css");
			return engapp.load(div, base+"/content.html");
		}
	};

	cfg = $.extend(defaultConfig, cfg);
	engapp.appPages[cfg.name] = cfg; 

}


engapp.navigation =  {
	openPage:gotoPage,
	pushPage:pushPage,
	substPage:substPage,
	changeHash: changeHash,
	registerPage: registerPage,
	parseAddress: parseAddress
};

engapp.onStart(init);



})();

function buildMainPage() {
		engapp.creaComponente('menu').then(function (menu) {
			$('.engapp-menu').append(menu.content);
		});
}
