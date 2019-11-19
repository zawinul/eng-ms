(function () {
viewport = ResponsiveBootstrapToolkit;
$(document).ready(function() {

	// ESEMPI....
	if(viewport.is('xs')) {
	}

	// Executes in SM, MD and LG breakpoints
	if(viewport.is('>=sm')) {
	}

	// Executes in XS and SM breakpoints
	if(viewport.is('<md')) {
		// ...
	}

	console.log('Current breakpoint: ', viewport.current());		
	$(window).resize(check);
	$(window).resize(
		viewport.changed(check)
	);
	check();
	setTimeout(check, 2000);
});
function check() {
	engapp.screensize = viewport.current()+" "+$(window).width()+"*"+$(window).height();	
	$('body').removeClass('xs sm md lg').addClass(viewport.current());
	$('body').removeAttr('wh').attr("wh", $(window).width()+"*"+$(window).height());
	
	$('body').toggleClass('xs-portrait', $(window).width()<560);
}
})();
