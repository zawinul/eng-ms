const Provider = require('oidc-provider');
const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const keystore = require('../certificati/keystore-private.json');
const mongoAdapter = require('./mongodb_adapter');
const cors = require('cors');
const myDebug = require('./debug-provider');
const Account = require('./account');
const clients = require('../clients.json').clients;
const helmet = require('helmet');
const { urlencoded } = require('express'); // eslint-disable-line import/no-unresolved
const body = urlencoded({ extended: false });
const path = require('path');
const querystring = require('querystring');

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
		altro: ['altro', 'altro_ancora']
	},
};

process.env.DEBUG = 'oidc-provider:*'; // funziona veramente?

var app = express();
//app.use(cors()); // TODO: se possibile rimuovere
app.use(helmet());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

http.createServer(app).listen(3000);
const sslOptions = {
	key: fs.readFileSync('certificati/eng-key-encrypted.pem'),
	cert: fs.readFileSync('certificati/eng-cert.pem'),
	passphrase: 'makkina19'
};
https.createServer(sslOptions, app).listen(3043);

const oidc = new Provider('https://oidc-provider:3043', configuration);
oidc.use(async (ctx, next) => {
	console.log(' ** middleware pre', ctx.method, ctx.path);	// ...
	await next();
	console.log(' ## middleware post', ctx.method); // ...
});

myDebug(oidc);

oidc.initialize({
	clients: clients,
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

app.use((req, res, next) => {
	const orig = res.render;
	// you'll probably want to use a full blown render engine capable of layouts
	res.render = (view, locals) => {
		app.render(view, locals, (err, html) => {
			if (err) throw err;
			orig.call(res, '_layout', {
				...locals,
				body: html,
			});
		});
	};
	next();
});

app.get('/interaction/:grant', async (req, res, next) => {
	try {
		const details = await oidc.interactionDetails(req);
		const client = await oidc.Client.find(details.params.client_id);
		console.log(details.interaction.error);
		if (details.interaction.error === 'login_required') {
			var scopes = details.params.scope.split(' ');
			return res.render('login', {
				client,
				details,
				title: 'Sign-in',
				scopes,
				params: querystring.stringify(details.params, ',<br/>', ' = ', {
					encodeURIComponent: value => value,
				}),
				interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
					encodeURIComponent: value => value,
				}),
			});
		}
		return res.render('interaction', {
			client,
			details,
			title: 'Authorize',
			params: querystring.stringify(details.params, ',<br/>', ' = ', {
				encodeURIComponent: value => value,
			}),
			interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
				encodeURIComponent: value => value,
			}),
		});
	} catch (err) {
		return next(err);
	}
});

app.post('/interaction/:grant/confirm', body, async (req, res, next) => {
	try {
		const result = { consent: {} };
		const details = await oidc.interactionDetails(req);
		await oidc.interactionFinished(req, res, result);
	} catch (err) {
		next(err);
	}
});

app.post('/interaction/:grant/login', body, async (req, res, next) => {
	const details = await oidc.interactionDetails(req);
	try {
		const account = await Account.findByLogin(req.body.login);
		var codes = [];
		for (var k in req.body) {
			if (k.indexOf('scope_')==0 && req.body[k]=='yes') {
				var c = k.substring(6);
				console.log("AUTORIZZATO "+c);
				codes.push(c);
			}
		}
		details.mieiCodici = codes;
		var result;
		if (!account) {
			result = {
				error: 'access_denied',
				error_description: 'Account inesistente o password sbagliata'
			};
		}
		else {
			result = {
				login: {
					account: account.accountId,
					acr: 'urn:mace:incommon:iap:bronze',
					amr: ['pwd'],
					remember: !!req.body.remember,
					ts: Math.floor(Date.now() / 1000),
				},
				consent: {
					scope: codes.join(' ')
				},
				"paolo andrenacci": {}
			}
		};

		await oidc.interactionFinished(req, res, result);
	} catch (err) {
		next(err);
	}
});

module.exports = {}