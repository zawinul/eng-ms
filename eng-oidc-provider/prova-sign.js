//const Provider = require('oidc-provider');
const Provider = require('./oidc-provider/lib/');
var conf = require('./config/provider-configuration.json');

// const fs = require('fs');
// const express = require('express');
// const http = require('http');
// const https = require('https');
// const mongoAdapter = require('./mongodb_adapter');
// const myDebug = require('./debug-provider');
// const Account = require('./account');
// const clients = require('../config/clients.json').clients;
// const helmet = require('helmet');
// const { urlencoded } = require('express'); // eslint-disable-line import/no-unresolved
// const body = urlencoded({ extended: false });
const path = require('path');
// const ejs = require('ejs');
const base64 = require('base-64');
// const debug = require('debug');
// const log = debug('provider');
const keystore = require('./certificati/keystore-private.json');

const {
	JWK: { isKeyStore },
	JWS: { createSign, createVerify },
	JWE: { createEncrypt, createDecrypt },
} = require('node-jose');
const { stringify, parse } = JSON;
const format = 'compact';
const typ = 'JWT';
	
var oidc = 	new Provider('https://oidc-provider:3043', conf);
oidc.initialize({
	keystore: keystore
})
.then(() => {
	//app.use('/', oidc.callback);
	//log('oidc-provider listening on port 3000,\ncheck https://oidc-provider:3043/.well-known/openid-configuration');
	doit();
})
.catch((err) => {
	console.log(err);
	process.exitCode = 1;
});

function doit() {
	var payload  = {
		"jti": "lsL4MlmlmENoRQWBPctCa",
		"sub": "23121d3c-84df-44ac-b458-3d63a9a05497",
		"iss": "https://oidc-provider:3043",
		"iat": 1536068978,
		"exp": 1536072578,
		"scope": "openid profile dati_applicativi altro servizio1 servizio5",
		"aud": "foo"
	};
	
	var alg = "RS256";
	const key = oidc.keystore.get( alg, "sign" );
	var fields = {
		alg:"RS256", 
		typ:"JWT"
	};
	
	var x = createSign({fields, format}, { key, reference: key.kty !== 'oct' })
		.update(JSON.stringify(payload), 'utf8')
		.final();
	
	console.log(x);
	
}
