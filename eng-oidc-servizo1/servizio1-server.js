console.log('CONSUMER v 1.1');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const base64 = require('base-64');
const path = require('path');
const jwt = require('jsonwebtoken');
const validazioneRichiesta = require('./validazione-richiesta');


// serve a fare in modo che nelle chiamate https siano accettati anche certificati autofirmati
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app;

function initExpress() {
	app = express();
	app.use(express.json());       // supporta JSON-encoded bodies
	app.use(express.urlencoded()); // supporta URL-encoded bodies
	http.createServer(app).listen(4100);
	var sslOptions = {
		cert: fs.readFileSync('certificati/my-https-cert.pem'),
		key:  fs.readFileSync('certificati/my-https-key-encrypted.pem'),
		passphrase: 'ZHCC JTXP'
	};

	https.createServer(sslOptions, app).listen(4143);
}

var cnt = 1;
function routings() {

	app.use(function(req, res, next) {
		console.log('app.use');
		validazioneRichiesta(req, 'servizio1')
			.then(data=>{
				console.log('ok proseguo');
				next();
			})
			.catch(error=>{
				res.status(400).send(error);
			});
	});

	app.get('/pippo', function(req, res) {
		console.log('get /pippo '+cnt);
		res.status(200).send('OK '+cnt++ + 
		"<pre>"+JSON.stringify(req.userInfo,null,2) +"</pre>");
	});

}


initExpress();
routings();
console.log('service started on http://oidc-servizio1/4100 o https://oidc-servizio1/4143');
