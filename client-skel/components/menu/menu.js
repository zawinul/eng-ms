(function(){

	var div, barra;

function init(callback) {
	div = $(".engapp-menu");
	engapp.load("components/menu/menu.css");
	engapp.load(div, "components/menu/menu.html").then(function(){
		// if (engapp.setStyleMenu)
		// 	engapp.setStyleMenu();

		$('.navbar-brand').click(function() {
			$('.navbar-brand').text(engapp.screensize);
			setTimeout(function(){
				$('.navbar-brand').text("ENGAPP");
			}, 2000);
		})
		$('.navbar-brand').dblclick(function() {
			location.href=".?x="+(new Date()).getTime();
		})

		$('[open-page]').click(function(evt){
			evt.preventDefault();
			$('#navbar').collapse("hide")
			var dest = $(this).attr('open-page');
			console.log('open page '+dest);
			engapp.openPage(dest);
		});

		$('a', div).each(function(){
			var h = $(this).attr('href'); 
			if (!h) {
				$(this).attr('href', 'javascript:void(0)');
			}
		})
		if (callback)
			callback();	
	});
}	
engapp.setMenuActive = function(label) {
	$('.active', div).removeClass('active');
	$('.'+label, div).addClass('active');
}

engapp.onStart(init);
	
})()


 