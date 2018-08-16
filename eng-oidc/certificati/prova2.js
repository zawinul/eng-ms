var fs = require('fs');
var rsaPemToJwk = require('rsa-pem-to-jwk');
 
var pem_private = fs.readFileSync('certificati/private2.pem');
var jwk_private = rsaPemToJwk(pem_private, {use: 'sig'}, 'private');
fs.writeFileSync('certificati/private2.jwk', JSON.stringify(jwk_private, null,2));

var pem_public = fs.readFileSync('certificati/public2.pem');
var jwk_public = rsaPemToJwk(pem_public, {use: 'sig'}, 'public');
fs.writeFileSync('certificati/public2.jwk', JSON.stringify(jwk_public, null,2));
console.log(jwk_public);