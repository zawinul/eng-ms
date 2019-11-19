var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('bootswatch.json', 'utf8'));
for(var i=0;i<obj.themes.length; i++) {
	var t = obj.themes[i];
	var url = t.cssCdn;
	console.log("curl "+url+" > "+t.name+".css");
}