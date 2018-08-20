function addTokenMessageListener() {
	if (!window.tokenListenerAdded) {
		window.addEventListener("message", function (event){
			//console.log({event:event});
			try {
				var msg = JSON.parse(atob(event.data));
				//console.log({msg:msg});
				localStorage.cspot4Token = msg.token;
				getToken.expire = new Date().getTime()+3600*1000;
				localStorage.cspot4TokenExpire = ""+getToken.expire;
				d.resolve(msg.token);
			}catch(e){ }
		}, false);
		window.tokenListenerAdded = true;
	}
}
addTokenMessageListener();

function doLogin() {
	var iframe = $('<iframe/>').appendTo('body');
	iframe.css({
		zIndex:9999,
		backgroundColor:'#fcfcff',
		position:'absolute',
		left: '10%',
		width:'80%',
		top:'10%',
		height: '90%',
		minHeight:'400px',
		border:'1px solid gray',
		padding:4
	});

	var rndState = "state"+Math.random();
	var rndNonce = "nonce"+Math.random();
	var params = {
		client_id: 'foo',
		response_type: 'code',
		scope: 'openid profile email altro ',
		state: rndState,
		nonce: rndNonce, 
		redirect_uri: 'https://oidc-provider:3043/callback'
	};
	var a=[];
	for(var k in params)
		a.push(k+'='+escape(params[k]));
	var u = 'https://oidc-consumer:5043/login.html';
	alert(u);
	iframe.attr('src', u);
}
