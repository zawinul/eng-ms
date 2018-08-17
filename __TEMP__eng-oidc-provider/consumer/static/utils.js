var code;
function getInfo() {
	try {
		var params = location.href.split('?')[1].split('&').map(x => x.split('='));
		code = params.filter(a => a[0] == 'code')[0][1];
		console.log('code=' + code);
		$('#code').val(code);	
	} catch (error) {}
}


function doPost() {
	var params = {
		grant_type:"authorization_code",
		code: code, 
		// client_id:"foo",
		// client_secret:"bar",
		response_type: "code", 
		scope: "openid", 
		redirect_uri:"https://oidc-consumer:5043/callback"
	}

	$.ajax({
		url: "https://oidc-provider:3043/token",
		method: "POST",
		headers:{
			 Authorization: "Basic "+btoa("foo:bar")
		},
		data: params,
		success: onData,
		error: function() {
			console.log('error', arguments)
		}
	})
}

function onData(data) {
	console.log('onData', arguments);
	var e = $('#results').empty();
	$('<h4/>').appendTo(e).text('data');
	$('<pre/>').appendTo(e).text(JSON.stringify(data,null,2));
	var acc = JSON.parse(atob(data.access_token.split('.')[1]));
	$('<h4/>').appendTo(e).text('access_token');
	$('<pre/>').appendTo(e).text(JSON.stringify(acc,null,2));
	var id = JSON.parse(atob(data.id_token.split('.')[1]));
	$('<h4/>').appendTo(e).text('id_token');
	$('<pre/>').appendTo(e).text(JSON.stringify(id,null,2));
	$('<button/>').appendTo(e).text('get user info').click(getUserInfo);
	$('<button/>').appendTo(e).text('verify token').click(doVerify);

	function getUserInfo() {
		$.ajax({
			method:'GET',
			url:'https://oidc-provider:3043/me',
			headers: {
				Authorization: 'Bearer '+data.access_token
			},
			success:function(data) {
				$('<pre/>').appendTo(e).text(JSON.stringify(data,null,2));
			},
			error: function(){
				console.log('error', arguments);
			}
		});
	}
	function doVerify() {
		$.ajax({
			method:'POST',
			url:'token-verify',
			data: {
				token: data.id_token
			},
			success:function(data) {
				$('<pre/>').appendTo(e).text(JSON.stringify(data,null,2));
			},
			error: function(){
				console.log('error', arguments);
			}
		});
	}

}
