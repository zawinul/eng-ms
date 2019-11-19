(function(){
	
var div;

function init(callback) {
	div = $("footer.footer");
	engapp.load("components/footer/footer.css");
	engapp.load(div, "components/footer/footer.html").then(function(){
		if (callback)
			callback();
	});		
}	


engapp.onStart(init);
	
})()