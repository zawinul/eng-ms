const jose = require('node-jose');
const fs = require('fs');
const path = require('path');
const dir = __dirname;

function dump(store, filename) {
	let x = store.toJSON(true);
	let y = JSON.stringify(x,null,2);
	fs.writeFileSync(path.resolve(dir,filename), y, {encoding:'UTF-8'});
	return store;
}

function add(store, pemfile) {
	var pem = fs.readFileSync(path.resolve(dir,pemfile),{encoding:'UTF-8'});
	return store.add(pem, "pem")
		.then(()=>store);
}

var p1 = Promise.resolve(jose.JWK.createKeyStore())
.then(store=> add(store, 'eng-cert.pem'))
.then(store=> dump(store, 'keystore-public.json'));

var p2 = Promise.resolve(jose.JWK.createKeyStore())
.then(store=> add(store, 'eng-key-unencrypted.pem'))
.then(store=> dump(store, 'keystore-private.json'));

var p3 = Promise.resolve(jose.JWK.createKeyStore())
.then(store=> add(store, 'eng-key-unencrypted.pem'))
.then(store=> add(store, 'eng-cert.pem'))
.then(store=> dump(store, 'keystore-both.json'));


Promise.all([p1,p2,p3])
.then(()=>console.log("done 1,2 and 3"))
.catch(x=>{throw x;});
