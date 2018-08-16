const Provider = require('oidc-provider');
const myData = require('../config-data');
const express = require('express');
const http = require('http');
const https = require('https');
const keystore = require('../certificati/keystore-private.json');
const mongoAdapter = require('./mongodb_adapter');
const cors = require('cors');
const myDebug = require('./debug-provider');
const Account = require('./account');

const configuration = {
	formats: {
		default: 'opaque',
		AccessToken: 'jwt',
	},
	features: {
		claimsParameter: true,
		conformIdTokenClaims: true,
		discovery: true,
		encryption: true,
		introspection: true,
		registration: true,
		request: true,
		revocation: true,
		sessionManagement: true,
	},
	findById: Account.findById,
	claims: {
		// scope: [claims] format
		openid: ['sub'],
		email: ['email', 'email_verified'],
		altro: ['altro','altro_ancora']
	},
};

process.env.DEBUG = 'oidc-provider:*'; // funziona veramente?

var app = express();
app.use(cors()); // TODO: se possibile rimuovere
http.createServer(app).listen(3000);
https.createServer(myData.sslOptions, app).listen(3043);

const oidc = new Provider('https://oidc-provider:3043', configuration);
oidc.use(async (ctx, next) => {
	console.log(' ** middleware pre', ctx.method, ctx.path);	// ...
	await next();
	console.log(' ## middleware post', ctx.method); // ...
});

myDebug(oidc); 

oidc.initialize({
	clients: myData.clients,
	keystore: keystore,
	adapter: mongoAdapter
})
	.then(() => {
		app.use('/', oidc.callback);
		console.log('oidc-provider listening on port 3000,\ncheck https://oidc-provider:3043/.well-known/openid-configuration');
	})
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
	});

module.exports = {}