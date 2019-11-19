(function _navigation() {


var opened = [];	
var curr;
var ignoraHashChange = false;

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
}


function main() {
	engapp.breadcrumb.clear();
	localOpenPage('in-vetrina', {isMain:true});	
}

function parseAddress() {
	debugger;
	console.log("parseAddress: "+location.href);
	var p = location.href.indexOf('#');
	if (p<0) 
		return main();
	

	// hash = url dal # in poi
	var hash = (p>=0) ? location.href.substring(p) : "#";
	p = hash.indexOf('?');
	var page = (p>=0) ? hash.substring(1,p) : hash.substring(1);
	var query = (p>=0) ? hash.substring(p+1) : "";

	if (page.substring(0,1)=="/")
		page = page.substring(1);
	if (page=="")
		return main();

	var params = {};
	query = query.split("&");
	for(var i=0;i<query.length; i++) {
		var par = query[i];
		p = par.indexOf("=");
		if (p<0)
			continue;
		var key = par.substring(0,p);
		var value = par.substring(p+1);
		params[key] = value;
	}
	
	engapp.queryParams = params;

	// aggiungo lo stato corrente al breadcrumb
	engapp.breadcrumb.push(page, hash);

	// aggiorno la UI
	localOpenPage(page, params);	
}

function camelize(str) {
	if (typeof(str)!='string')
		return str;
	var p = str.indexOf('-');
	if (p<0)
		return str;
	else return str.substring(0,p)
		+ str.substring(p+1,p+2).toUpperCase()
		+ camelize(str.substring(p+2));
}


function gotoPage(name, params) {
	console.log('goto '+name);
	engapp.breadcrumb.clear();
	pushPage(name, params);
}


function substPage(name, params) {
	console.log('subst '+name);
	engapp.breadcrumb.pop();
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
	engapp.currHash = "";
	if (arr.length>0) {
		engapp.currHash = arr.join('&');
		adr += "?" + engapp.currHash;
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
	var adr = "#/"+name;
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

	var cname = camelize(name);
	var next = engapp.appPages[cname];
	if (next==null) {
		// la pagina 'name' non è mai stata caricata in precedenza, caricala e ripeti l'operazione
		engapp.caricaPagina(name).then(function(){
			localOpenPage(name, params);
		});
		return;
	}

	engapp.setMenuActive(null);
	
	
	params = params || {};
	console.log('jumping to ' + cname + ' '+!!next);
	$('body').waitStart();

	// usciamo dalla pagina di provenienza
	var prev = (engapp.currPage) 
		? engapp.appPages[camelize(engapp.currPage)] 
		: null;
	if (prev) {
		var k = prev.deactivate(name, params);
		if (typeof(k)=='undefined')
			return go(true);
		else if (!k) 
			return go(false); 
		else 
			when(k).then(go);
	}
	else
		go(true);
	
	function go(reallyJump) { // salta alla pagina target
		$('body').waitStop();

		if (reallyJump) {
			engapp.currPage = name;
			if (opened.indexOf(next)<0)
				opened.push(next);
			document.title = "ENGAPP - "+name.replace('-', ' ');
			if (next.init) {
				if (!next._initialized) {
					function f()  {
						next._initialized = true; 
						start();
					}
					next.init(f);
				}
				else
					start(); 
			}
			else
				start(); 
		}
	}
	
	function start() {
		console.log({ openPage:name, params:params});
		next.activate(params); 
		engapp.breadcrumb.draw();
	}
}


function susbstPage(name, params) {

}

function home() {
	parseAddress();
}

engapp.onStart(init);

$.extend(engapp,  {
	openPage:gotoPage,
	pushPage:pushPage,
	substPage:substPage,
	changeHash: changeHash,
	home: home
});

})();