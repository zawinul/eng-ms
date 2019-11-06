$(function(){
	oidc.getAccessToken().then(function(token){
		$('.result').val(token);
		var x = token.split('.')[1];
		var obj = JSON.parse(atob(x));
		var txt = JSON.stringify(obj,null,2);
		$('.dump').text(txt);
	});
});

