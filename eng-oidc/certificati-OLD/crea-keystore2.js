const jose = require('node-jose');
const fs = require('fs');

var keystore = jose.JWK.createKeyStore();
var publicPem = fs.readFileSync('./eng-cert.pem',{encoding:'UTF-8'});
var privatePem = fs.readFileSync('./eng-key.pem',{encoding:'UTF-8'});
keystore.add(publicPem, "pem").
then(()=>{
	let x=keystore.toJSON(true);
	let y = JSON.stringify(x,null,2);
	fs.writeFileSync('./keystore2.json', y, {encoding:'UTF-8'});
	let p = keystore.add(privatePem, "pem");
	return p;
}). 
then(()=>{
	return;
	// var x=keystore.toJSON(true);
	// var y = JSON.stringify(x,null,2);
	// fs.writeFileSync('./certificati/keystore2.json', y, {encoding:'UTF-8'});

	let x=keystore.toJSON(false);
	let y = JSON.stringify(x,null,2);
	fs.writeFileSync('./keystore2b.json', y, {encoding:'UTF-8'});

	console.log("y=",y);
}).catch((e)=>{
	console.log("ERROR",arguments);
	throw e;
});