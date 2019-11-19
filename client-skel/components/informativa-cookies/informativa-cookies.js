(function (){

engapp.onStart(function() {
	const cookieName = "VenditeEAffittiCookieAccettati";
	if (Cookies.get(cookieName)) {
		//alert('cookies già accettati');
		return;
	}
	
	div = $('<div/>');
	
	engapp.load('components/informativa-cookies/informativa-cookies.css');
	engapp.load(div, 'components/informativa-cookies/informativa-cookies.html').then(function(){
		$('body').prepend(div);
		$('.chiudi, button', div).click(function() {
			Cookies.set(cookieName, '1', { expires: 365*10 });
			div.animate({height:0},500, function(){
				div.remove();
			})
		});
	});
	
});


})();