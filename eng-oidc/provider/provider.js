const Provider = require('oidc-provider');
const myData = require('../config-data');
const express = require('express');
const http = require('http');
const https = require('https');
const keystore = require('./keystore.json');
const mongoAdapter = require('./mongodb_adapter');
var cors = require('cors');

var conf = myData.configuration;
	
process.env.DEBUG = 'oidc-provider:*';

var app = express();
app.use(cors()); // TODO: se possibile rimuovere
http.createServer(app).listen(3000);
https.createServer(myData.sslOptions, app).listen(3043);

conf.keystore = keystore;
conf.adapter = mongoAdapter;

// conf.clients = [
//     // reconfigured the foo client for the purpose of showing the adapter working
//     {
//       client_id: 'foo',
//       redirect_uris: ['https://example.com'],
//       response_types: ['id_token token'],
//       grant_types: ['implicit'],
//       token_endpoint_auth_method: 'none',
// 	}
// ];

const oidc = new Provider('https://oidc-provider:3043', conf);
oidc.use(async (ctx, next) => {
	/** pre-processing
	 * you may target a specific action here by matching `ctx.path`
	 */
	console.log(' ** middleware pre', ctx.method, ctx.path);
  
	await next();
	/** post-processing
	 * since internal route matching was already executed you may target a specific action here
	 * checking `ctx.oidc.route`, the unique route names used are
	 *
	 * `authorization`
	 * `certificates`
	 * `client_delete`
	 * `client_update`
	 * `code_verification`
	 * `device_authorization`
	 * `device_resume`
	 * `end_session`
	 * `introspection`
	 * `registration`
	 * `resume`
	 * `revocation`
	 * `token`
	 * `userinfo`
	 * `webfinger`
	 * `check_session`
	 * `check_session_origin`
	 * `client`
	 * `discovery`
	 *
	 * ctx.method === 'OPTIONS' is then useful for filtering out CORS Pre-flights
	 */
	 console.log(' ## middleware post', ctx.method, ctx.oidc.route);
  });

require('./attach-events')(oidc);

// conf.findById = function(ctx, id) {
// 	return {
// 		accountId: id,
// 		async claims(use, scope) { return { sub: id }; },
// 	};
// }

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