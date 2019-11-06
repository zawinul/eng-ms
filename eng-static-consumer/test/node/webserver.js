console.log('ENG R3 WEB v 1.1');
const HTTPS_PORT=5047;
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
//const base64 = require('base-64');
const path = require('path');
//const oidc = require('./server-oidc-utils');
//const axios = require('axios');

// serve a fare in modo che nelle chiamate https siano accettati anche certificati autofirmati
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app;

function initExpress() {
	app = express();
	app.use(express.json());       // to support JSON-encoded bodies
	app.use(express.urlencoded()); // to support URL-encoded bodies
	app.use(express.static('static'));

	http.createServer(app).listen(5000);
	var sslOptions = {
		cert: fs.readFileSync('certificati/eng-cert.pem'),
		key:  fs.readFileSync('certificati/eng-key-encrypted.pem'),
		passphrase: 'PR76AA78FR'
	};

	https.createServer(sslOptions, app).listen(HTTPS_PORT);
}

function routings() {
	app.get('/', function(req, res) {
		res.redirect('/home.html');
	});
}

initExpress();
routings();
console.log('CONSUMER: go to https://127.0.0.1:'+HTTPS_PORT+'/');
