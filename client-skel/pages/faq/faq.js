(function(){
	var div;
	var faq;
	var categoriaTemplate, elementoTemplate;
	function activate(par) {
		div.appendTo('.engapp-page-container');
		vendite.setMenuActive('faq');		
	}
		
	
	function deactivate() {
		div.detach();
	}
	
	function init(callback) {
		div = $('<div/>').appendTo('.engapp-page-container');
		vendite.load("pages/faq/faq.css");
		vendite.load(div, "pages/faq/faq.html").then(function(){
			categoriaTemplate = $('.categoria', div).detach();
			elementoTemplate = $('.elemento', categoriaTemplate).detach();
			vendite.ajax.getFAQ(function(f){
				faq = f;
				setData();
				callback();
			});
		});
	}
	
	function setData() {
		var idSeed = 0;
		var map = {}
		for(var i=0; i<faq.categorie.length; i++) {
			var cat = faq.categorie[i];
			var id = cat.id;
			var catdiv = categoriaTemplate.clone();
			$('.contenitore-categorie', div).append(catdiv);
			map[id] = catdiv;
			$('[data-target]', catdiv).attr('data-target', '.faq-cat-'+id);
			$('.collapse', catdiv).addClass('faq-cat-'+id);
			$('.nome-categoria', catdiv)
				.text(cat.tipo)
				.data('tipo', cat.tipo)
				.click(tracciaturaCategoria);
		}

		for (var i=0; i<faq.elementi.length; i++) {
			var elemento = faq.elementi[i];
			var id = elemento.id;
			var parent = map[elemento.categoria];
			if (!parent)
				continue;
			var eldiv = elementoTemplate.clone();
			$('.lista-elementi', parent).append(eldiv);

			$('[data-target]', eldiv).attr('data-target','.faq-elem-'+id);
			$('.collapse', eldiv).addClass('faq-elem-'+id);
			$('.testo-domanda', eldiv).text(elemento.domanda);
			$('.testo-risposta', eldiv).html(elemento.risposta);
		}

	}

	function tracciaturaCategoria() {
		var el = $(this);
		var tipo = el.data('tipo');

	}

	vendite.appPages.faq = {
		activate:activate,
		deactivate:deactivate,
		init:init
	}
	
})()