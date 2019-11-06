const carlo = require('carlo');
const thisDir = __dirname;
// (async () => {
// 	const app = await carlo.launch();

// 	// Tell carlo where your web files are located.
// 	app.serveFolder(thisDir);

// 	// Expose 'env' function in the web environment.
// 	await app.exposeFunction('env', _ => process.env);

// 	// Navigate to the main page of your app.
// 	await app.load('example.html');
// })();
function x() {
	carlo.launch().then(function(app){
		app.serveFolder(thisDir);
		app.exposeFunction('env', _ => process.env).then(function(){
			app.load('example.html');
		});
	});
}
x();