(function(){
	
var div;

function init() {
	div = $("footer.footer");
	engapp.load("components/footer/footer.css");
	engapp.load(div, "components/footer/footer.html");		
}	


engapp.onStart(init);
	
})()