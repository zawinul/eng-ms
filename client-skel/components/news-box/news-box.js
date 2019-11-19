(function(){

var ready = $.Deferred();	
var div, newsContainer, newsTemplate;

function init() {
	var d = $('<div/>');
	div = $("<div/>").addClass("vendite-ricerca");
	engapp.load("components/news-box/news-box.css");
	engapp.load(d, "components/news-box/news-box.html").then(function() {
		div = ('.vendite-news', d);
		newsContainer=$('.news-container', div);
		newsTemplate = $('.news-template', newsContainer).detach();
		engapp.ajax.getNews(function(news){

			for(var i=0;i<news.length;i++)
				appendNews(news[i],i)
			ready.resolve();
		})
		$('.jump-news', div).click(function(){
			engapp.pushPage('news');
		})

	});
}

function appendNews(articolo, position) {
	var d = newsTemplate.clone();
	d.addClass((position%2) ? "odd" : "even"); 
	
	var m = engapp.util.stringToMoment(articolo.dataIns); 
	$('.data-articolo',d).text(m.format("D MMM YYYY"));

	$('.titolo', d).text(articolo.titolo);
	$('.contenuto .inner', d).html(articolo.descrizione);
	newsContainer.append(d);
}

engapp.setBoxNews = function(container, callback) {
	ready.then(function(){
		engapp.ajax.getNews(function(){
			div.detach().appendTo(container);

		})
	})
}
engapp.onStart(init);

})()


 