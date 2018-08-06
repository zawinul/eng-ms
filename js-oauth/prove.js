var Request = require('oauth2-server').Request;
var Response = require('oauth2-server').Response;


// prova ad entrare
function prova1(server) {

	var request = new Request({ 
		body: { 
			client_id: 'thom', 
			client_secret: 'ERRORnightworld', 
			response_type: 'code' 
		}, 
		headers: { 
			'Authorization': 'Bearer foo' 
		}, 
		method: { }, 
		query: { 
			state: 'foobar' 
		} 
	});
	var response = new Response({ body: {}, headers: {} });
	
	var p = server.authorize(request, response);
	p.then(() => console.log(response))
	.catch(() => {
		console.log('fail', arguments, response)
	});
}

// chiede autorizzazione
function prova2(server) {

	var request = new Request({ 
		body: { 
			client_id: 'thom', 
			client_secret: 'ERRORnightworld', 
			response_type: 'code' 
		}, 
		headers: { 
			'Authorization': 'Bearer foo' 
		}, 
		method: { }, 
		query: { 
			state: 'foobar' 
		} 
	});
	var response = new Response({ body: {}, headers: {} });
	
	var p = server.authorize(request, response);
	p.then(() => console.log(response))
	.catch(() => {
		console.log('fail', arguments, response)
	});
}

function prove(server) {
	prova1(server);
}

module.exports = prove;
