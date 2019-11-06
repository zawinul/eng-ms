function processCallbackPage() {
	console.log('processCallbackPage');
	parseOidcCallback().then(function(x) {
		console.log('parseOidcCallback received');
		var y = { // x semolificato
			id_token: x.obj.id_token,
			access_token: x.obj.access_token,
			user: x.user,
			exp: x.access.exp
		};

		$('.dump').text(JSON.stringify(x, null,2));
		var params = x.state;

		if (params.dataToParent) { // ! same page
			var msg = {msg:"onOidcData",listenerId:params.listenerId, payload:y};
			window.opener.postMessage(JSON.stringify(msg,null,2), "*");
		}
		else if (params.restartFrom) { // same page
			if (verificaToken(x)) {

				localStorage.engSingleSignOnData = JSON.stringify(y, null,2);
				setTimeout(function(){
					location.href=params.restartFrom;
				}, 1);
			}
			else {
				location.href = 'authentication-failed.html?restart='+escape(btoa(params.restartFrom));
			}
		}
	});
}

function verificaToken(x) {
	console.log({verificaToken: x});
	var b1 = x.state.mark^localStorage.hmark^localStorage.hsecret;
	var b2 = x.id.nonce^localStorage.hnonce^localStorage.hsecret;
	if (b1!=0 || b2!=0) {
		alert('non mi quadra!!!');
		return false;
	}
	else {
		delete localStorage.hmark;
		delete localStorage.hnonce;
		delete localStorage.hsecret;
		return true;
	}
}


function parseOidcCallback() {
	console.log('parseOidcCallback');
	var ret = $.Deferred();
	var obj = {};
	var resp = location.href.split('#')[1];
	resp.split('&').map(function (x) {
		var y = unescape(x).split('=');
		obj[y[0]] = y[1];
	});

	var state = JSON.parse(atob(obj.state));
	var token = obj.access_token;
	console.log('calling userInfoFromToken');

	userInfoFromToken(obj.access_token).then(function(user) {
		console.log('received userInfoFromToken');
		var result = {
			obj:obj,
			state:state,
			id: JSON.parse(atob(obj.id_token.split('.')[1])),
			access:JSON.parse(atob(obj.access_token.split('.')[1])),
			user:user
		};
		console.log({result:result});
		console.log(JSON.stringify(result,null,2));
		ret.resolve(result);
		if (state.msgToParent) {
			console.log('sending message to parent');
			var msg = {
				msg: "onOidcData", 
				listenerId:state.listenerId, 
				payload:result
			};
			window.top.postMessage(JSON.stringify(msg), "*");
		}
	});
	return ret;
}


function userInfoFromToken(accessToken) {
	var ret = $.Deferred();
	var get = $.ajax('https://oidc-provider:3043/me',{
		method:'GET',
		dataType: 'json', 
		headers: {
			Authorization: 'Bearer '+accessToken
		}
	});

	get.then(function(response) {
		console.log("getUserInfo response", response);
		ret.resolve(response);
	})
	.catch(function(error) {
		ret.reject(error);
		console.log("getUserInfo error", error);
	});

	return ret;
}
