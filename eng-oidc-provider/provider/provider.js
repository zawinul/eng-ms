//const Provider = require('oidc-provider');
const Provider = require('../oidc-provider/lib/');
const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const keystore = require('../certificati/keystore-private.json');
const mongoAdapter = require('./mongodb_adapter');
const myDebug = require('./debug-provider');
const Account = require('./account');
const clients = require('../config/clients.json').clients;
const helmet = require('helmet');
const { urlencoded } = require('express'); // eslint-disable-line import/no-unresolved
const body = urlencoded({ extended: false });
const path = require('path');
const ejs = require('ejs');
const base64 = require('base-64');
const debug = require('debug');
const log = debug('provider');

//log.log = console.log.bind(console); // don't forget to bind to console!
debug.log = console.log.bind(console);

var configuration; 
var app;
var oidc;

function main() {
	configuration = getConfiguration(); 
	app = startWebServer();
	oidc = initOidc();
}

function getConfiguration() {

	var conf = require('../config/provider-configuration.json');
	
	async function logoutSource(ctx, form) {
		var p = path.resolve('./provider/views/logout.ejs');
		var s = fs.readFileSync(p, {encoding:'UTF-8'});
		var html = ejs.render(s, {form: form});
		ctx.body = html;
	}
	
	async function postLogoutRedirectUri(ctx) {
		var callerParams = ctx.req.query || {};
		var x = base64.encode(JSON.stringify(callerParams));
		return '/post-logout?q='+x;
	}

	var extra = {
		findById: Account.findById,
		logoutSource: logoutSource,
		postLogoutRedirectUri: postLogoutRedirectUri,
		interactionCheck: async function(ctx) { return false; }
	};
	Object.assign(conf, extra);
	return conf;
}


function startWebServer() {
	app = express();
	app.use(helmet());

	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	
	http.createServer(app).listen(3000);
	const sslOptions = {
		key: fs.readFileSync('certificati/eng-key-encrypted.pem'),
		cert: fs.readFileSync('certificati/eng-cert.pem'),
		passphrase: 'makkina19'
	};

	routing();

	https.createServer(sslOptions, app).listen(3043);
	return app;
}

function initOidc() {
	oidc = new Provider('https://oidc-provider:3043', configuration);
	oidc.use(async (ctx, next) => {
		log(' ** middleware pre', ctx.method, ctx.path);	// ...
		await next();
		log(' ## middleware post', ctx.method); // ...
	});
	
	myDebug(oidc);
	
	oidc.initialize({
		clients: clients,
		keystore: keystore,
		adapter: mongoAdapter
	})
	.then(() => {
		app.use('/', oidc.callback);
		log('oidc-provider listening on port 3000,\ncheck https://oidc-provider:3043/.well-known/openid-configuration');
	})
	.catch((err) => {
		log(err);
		log(err.stack);
		process.exitCode = 1;
	});
	return oidc;	
}


function routing() {

	app.get('/post-logout', async (req, res, next) => {
		return res.render('post-logout');
	});
	
	app.get('/interaction/:grant', async (req, res, next) => {
		// il cliente chiede login+autorizzazione,
		// sto per saltare alla pagina di login-e-autorizzazione (se non sono loggato) 
		// o di autorizzazione
		try {
			const details = await oidc.interactionDetails(req);
			const client = await oidc.Client.find(details.params.client_id);
			log(details.interaction.error);
			var scopes = details.params.scope.split(' ');
			var pageData = {
				client,
				details,
				scopes,
				params: details.params,
				interaction: details.interaction
			};
			if (details.interaction.error === 'login_required') 
				return res.render('login-e-autorizzazione', pageData);
			else  
				return res.render('autorizzazione', pageData);
		} 
		catch (err) {
			return next(err);
		}
	});
	
	app.post('/interaction/:grant/confirm', body, async (req, res, next) => {
		// sono di ritorno da una pagina di autorizzazione
		try {
			// var codes = [];
			// for (var k in req.body) {
			// 	if (k.indexOf('scope_')==0 && req.body[k]=='yes') 
			// 		codes.push(k.substring(6));
			// }
			const result = { 
				// consent:  {
				// 	scope: codes.join(' ')
				// } 
			};
			const details = await oidc.interactionDetails(req);
			await oidc.interactionFinished(req, res, result);
		} catch (err) {
			next(err);
		}
	});
	
	app.post('/interaction/:grant/login', body, async (req, res, next) => {
		// sono di ritorno da una pagina di login-e-autorizzazione
		const details = await oidc.interactionDetails(req);
		try {
			var {login, password} = req.body;
			const account = await Account.findByLogin(login);
			// var codes = [];
			// for (var k in req.body) {
			// 	if (k.indexOf('scope_')==0 && req.body[k]=='yes') 
			// 		codes.push(k.substring(6));
			// }
			var result;
			if (!account) {
				result = {
					error: 'access_denied',
					error_description: 'Account inesistente o password sbagliata'
				};
			}
			else {
				const authenticated = await account.authenticate(password);
				if (authenticated) {
					result = {
						login: {
							account: account.accountId,
							acr: 'urn:mace:incommon:iap:bronze',
							amr: ['pwd'],
							remember: !!req.body.remember,
							ts: Math.floor(Date.now() / 1000),
							custom1 : 'c1' 
						},
						meta: {
							custom2 : 'c2'
						}
						// ,consent: {
						// 	scope: codes.join(' ')
						// }
					};
				}
				else {
					result = {
						error: 'access_denied',
						error_description: 'Account inesistente o password sbagliata'
					};
				}
			};
	
			await oidc.interactionFinished(req, res, result);
		} catch (err) {
			next(err);
		}
	});
	


	// attenzione: solo per debug
	const instance = require('../oidc-provider/lib/helpers/weak_cache.js');
	const JWT = require('../oidc-provider/lib/helpers/jwt');

	app.post('/genera-token', body, async (req, res, next) => {

		try {
			var payload = JSON.parse(req.body.payload) || {};
			var ks = instance(oidc).keystore;
			const key = ks.get({alg: 'RS256', use: "sig"} );
			var y = await JWT.sign(payload, key, 'RS256', {});

			res.send(y);
		}
		catch(e) {
			console.log(e);
		}
	});
}

main();
