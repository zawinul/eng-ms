var oidc = (function(){
	var listenerMap = {};

	var user;
	var accessToken;
	var camundaId;
	var expire;
	var valid = false;
	var singleWait = null;

	function initMessageListener() {
		if (initMessageListener.messageListenerInitialized)
			return;

		function onEvent(ev) {
			console.log({event:ev});
			var j = ev.data;
			var d = JSON.parse(ev.data);
			if (d.msg=="onOidcData") {
				var cb = listenerMap[d.listenerId];
				if (cb) {
					cb(d.payload);
					delete  listenerMap[d.listenerId];
				}
			}
		};
		
		if (window.addEventListener) 
			window.addEventListener("message", onEvent);
		else
			window.attachEvent("onmessage", onEvent);

		initMessageListener.messageListenerInitialized = true;
	};

	function tokenIsValid() {
		if (valid && (new Date().getTime()>expire)) {
			valid = false;
			singleWait = null;
		}
		return valid;
	}

	function _get() {
		//console.log('_get '+tokenIsValid()+' '+!!singleWait);
		
		if (!tokenIsValid() && singleWait)
			return singleWait;
		
		singleWait = $.Deferred();
		//console.log('call getCredentials');
		getCredentials().then(function(oidc) {
			camundaId = oidc.user.camunda_id;
			accessToken = oidc.access_token;
			user = oidc.user;
			expire = (new Date(oidc.exp*1000)).getTime();
			valid = true;
			//console.log('singlewait resolve');
			singleWait.resolve(oidc);
		});	
		
		return singleWait;
	}

	function getCredentials(samePage) {
		var ret = $.Deferred();
		if (localStorage.engSingleSignOnData) {
			var x = JSON.parse(localStorage.engSingleSignOnData);
			var exp = new Date(x.exp*1000);
			var now = new Date();
			if (now.getTime()<exp.getTime()) {
				ret.resolve(x);
				return ret;
			}
		}

		const mark = Math.floor(Math.random()*1000000000);
		const nonce = Math.floor(Math.random()*1000000000);
		const hsecret = Math.floor(Math.random()*1000000000);
		const hmark = mark^hsecret;
		const hnonce = nonce^hsecret;

		if (samePage) {
			localStorage.hmark = ""+hmark;
			localStorage.hnonce = ""+hnonce;
			localStorage.hsecret = ""+hsecret;
			var restart = location.href;

			var params = { restartFrom:restart, mark:mark };
			var u = urlForImplicitSingleSignOn("r3", params, nonce, location.origin+"/oidc/cb.html");
			location.href = u;
		}
		else {
			initMessageListener();
			var listenerId = ""+Math.random();
			var params = { dataToParent: true, listenerId: listenerId, mark:mark };
			var u = urlForImplicitSingleSignOn("r3", params, nonce, location.origin+"/oidc/cb.html");
			var w;
			listenerMap[listenerId] = function(d) {
				ret.resolve(d);
				localStorage.engSingleSignOnData = JSON.stringify(d, null,2);
				setTimeout(function(){
					w.close();
				}, 1);
			}
			w = window.open(u, "finestra-oidc");
		}

		return ret;
	}

	function urlForImplicitSingleSignOn(client, callerParams, nonce, cbURI) {

		var enc_state = btoa(JSON.stringify(callerParams));
		var params = {
			response_type: 'id_token token',
			state: enc_state,
			nonce: nonce, 
			client_id: client,
			scope: 'openid profile workflow dati_applicativi altro servizio1 servizio5 ',
			redirect_uri: cbURI
		};
		var a=[];
		for(var k in params)
			a.push(k+'='+escape(params[k]));
		var url = 'https://oidc-provider:3043/auth?'+a.join('&');
		return url;
	}

	function getUser() {
		if (tokenIsValid())
			return Promise.resolve(user);

		var ret = $.Deferred();
		_get().done(function(){ 
			ret.resolve(user);
		});
		return ret;
	}

	function getAccessToken() {
		//console.log('getAccessToken '+ tokenIsValid());
		if (tokenIsValid())
			return Promise.resolve(accessToken);

		var ret = $.Deferred();
		_get().done(function(){ 
			ret.resolve(accessToken);
		});
		return ret;
	}


	return {
		getUser:getUser,
		getAccessToken: getAccessToken,
		getCredentials:getCredentials
	}

})();

function getUrlParams(url) {
	var ret = {};
	if (url.indexOf('?')<0)
		return ret;

	url.split('?')[1].split('&').map(function(x) {
		var y = x.split('=');
		ret[y[0]] = unescape(y[1]);
	});
	return ret;
}