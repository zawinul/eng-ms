console.log('CONSUMER v 1.1');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
const base64 = require('base-64');
const path = require('path');
const oidc = require('./server-oidc-utils');
const session = require('express-session');
const axios = require('axios');

// serve a fare in modo che nelle chiamate https siano accettati anche certificati autofirmati
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app;

function initExpress() {
	app = express();
	app.use(express.json());       // to support JSON-encoded bodies
	app.use(express.urlencoded()); // to support URL-encoded bodies
	app.use(express.static('consumer/static'));
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true }
	}));

	http.createServer(app).listen(5000);
	var sslOptions = {
		cert: fs.readFileSync('certificati/my-https-cert.pem'),
		key:  fs.readFileSync('certificati/my-https-key-encrypted.pem'),
		passphrase: 'AWZXH2424-K8'
	};

	https.createServer(sslOptions, app).listen(5043);
}

function routings() {
	app.get('/', function(req, res) {
		if (!req.session.prova)
			req.session.prova=1;
		console.log('prova='+req.session.prova);
		req.session.prova++;

		var sessData = req.session;
		res.redirect('/home.html');
	});

	app.get('/do-login-foo', function (req, res) {
		var url = oidc.urlToSingleSignOn('foo', req.query);
		console.log('redirecting to '+url);
		res.redirect(url);
	});


	app.get('/do-login-foo2', function (req, res) {
		var url = oidc.urlToSingleSignOn('foo2', req.params);
		console.log('redirecting to '+url);
		res.redirect(url);
	});


	app.get('/do-login', function (req, res) {
		var url = oidc.urlToSingleSignOn();
		console.log('redirecting to '+url);
		res.redirect(url);
	});

	
	app.get('/do-logout', function (req, res) {
		res.redirect("https://oidc-provider:3043/session/end?a=b&c=x%20y");
	});

	app.get('/chiama-servizio1', function (req, res) {
		var p = axios({
			method: 'get',
			url: 'https://oidc-servizio1:4143/pippo?a=1&b=2', 
			//data: querystring.stringify({a:1, b:2}),
			headers: {
				Authorization: "Bearer "+req.session.access_token
			}
		})
		.then(response=>{
			console.log('on received data ', response.data);
			res.status(200).send('OK: '+response.data);
		})
		.catch(error=> {
			console.log('error', error);
			res.status(400).send('KO: ' + error);
		});	
	});

	app.get('/callback', function (req, res) {
		var code = req.query.code;
		var state = JSON.parse(base64.decode(req.query.state));
		if (state.mark!=oidc.stateMark)
			throw "errore nello stato ritornato";
		var p = oidc.askToken(code, state.client);
		p.then(data=>{
			req.session.access_token = data.access_token;
			req.session.id_token = data.id_token;
			var msg = "access_token e id_token sono stati salvati in sessione";
			if (data.userId.nonce!=state.nonce)
				throw "errore nello stato ritornato";
			var ret = {params:state.p, data:data};

			return res.render('callback', {data:ret, msg:msg});
		}).catch(error=>{
			res.send("ERROR: "+JSON.stringify(error));
		});
	});
}

initExpress();
routings();
console.log('CONSUMER: go to https://oidc-consumer:5043/');
