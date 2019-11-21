(function(){
	
var div;

function init() {
	div = $(".engapp-header");
	engapp.load("components/header/header.css");
	engapp.load(div, "components/header/header.html");
}

engapp.onStart(init);

})()

 