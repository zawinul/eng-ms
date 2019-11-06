console.log('SERVIZIO1 v 1.1');
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

	// validazione 
	app.use(async function(req, res, next) {
		try {
			await validazioneRichiesta(req, 'servizio1');
			console.log('validazione ok');
			next();
		}
		catch(error) {
			console.log('errore: '+error.message);
			res.status(400).send(error.message);
		}
	});

}

function routings() {

	app.get('/pippo', function(req, res) {
		res.status(200).send('ciao pippo');
	});

	app.get('/me', function(req, res) {
		console.log('get /me');
		res.status(200).send(
			JSON.stringify(req.userInfo,null,2)
		);
	});

}


initExpress();
routings();
console.log('service started on http://oidc-servizio1/4100 and https://oidc-servizio1/4143');
