function doLogin() {
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
	var u = 'https://oidc-provider:3043/auth?'+a.join('&');

	var iframe = $('<iframe/>').appendTo('body').css({
		zIndex:999,
		position: 'absolute',

	})
}
$(function() {
	var a=[];
	for(var k in params)
		a.push(k+'='+escape(params[k]));
	var u = 'https://oidc-provider:3043/auth?'+a.join('&');
	$('#authlink').attr('href', u);
	$('#authdesc').html(u);
});
