(function(){

var div;

function init() {
	div = $(".engapp-menu");
	engapp.load("components/menu/menu.css");
	engapp.load(div, "components/menu/menu.html").then(function(){
		$('a', div).not('[href]').attr('href', 'javascript:void(0)');

		$('[open-page]', div).click(function(evt){
			evt.preventDefault();
			$('#navbar').collapse("hide")
			var dest = $(this).attr('open-page');
			console.log('open page '+dest);
			engapp.openPage(dest);
		});

	});
}

engapp.setMenuActive = function(label) {
	$('.active', div).removeClass('active');
	$('.'+label, div).addClass('active');
}

engapp.onStart(init);
	
})()


 