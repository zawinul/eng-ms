(function(){

function init() {

	var p1 = engapp.creaComponente('menu').then(function (menu) {
		$('.engapp-menu').append(menu.content);
	});

	var p2 = engapp.creaComponente('footer').then(function(footer) {
		$('footer').append(footer.content);
	});

	var p3 = engapp.creaComponente('breadcrumb').then(function(breadcrumb) {
		$('.engapp-breadcrumb').append(breadcrumb.content);
	});

	return Promise.all([p1, p2, p3]);
}

engapp.components['layout'] = {
	init: init
};

})();

