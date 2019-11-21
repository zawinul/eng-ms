(function(){
	
var content;

function create() {
	var div = $("<div/>");
	return engapp.load(div, "components/footer/content.html").then(function(){
		return {
			content: div.children()
		};
	});		
}	

engapp.load("components/footer/style.css");
engapp.components.footer = {
	create: create
};
	
})();