const { 
	JWK: { 	createKeyStore, asKeyStore, asKey } 
} = require('node-jose');


const AdapterTest = require('./adapter_test');


const Provider = require('./provider');


const errors = require('./helpers/errors');

Object.assign(Provider, {
	AdapterTest,
	createKeyStore,
	asKeyStore,
	asKey,
	errors
});

module.exports = Provider;
