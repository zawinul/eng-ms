var LRU = require("lru-cache");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const oidcCertPem = fs.readFileSync('certificati/oidc-provider-certificate.pem',{encoding:'UTF8'});
const axios = require('axios');
const randomstring = require("randomstring");

var authCache, infoCache;
var testToken, testTokenData, testUserInfo;

function init() {
	authCache = LRU(1000);
	infoCache = LRU(1000);
	testToken = randomstring.generate({charset:'alphabetic', length:8, capitalization:'uppercase' });
	var now = Math.floor(new Date().getTime()/1000);

	testTokenData = {
		jti: randomstring.generate(20),
		sub: "prova-servizio1",
		iss: "https://oidc-provider:3043",
		iat: now,
		exp: now+24*60*60,
		scope: "openid profile dati_applicativi altro servizio1 servizio5",
		aud: "foo"
	};

	testUserInfo = {
		sub: "prova-servizio1",
		organigramma: [{
			societa: "pippo",
			dipartimento: "pluto",
			ruolo: "direttore"
		}],
		abilitazioni: [{
				sistema: "protocollo",
				ambito: "affari legali",
				profilo: "inserimento dati"
			}
		]
	}
	initCache();
	console.log("Per test autenticare con \"Bearer "+testToken+"\"");
}

function initCache() {
	authCache.reset();
	infoCache.reset();
	authCache.set(testToken, testTokenData, 24*60*60*1000);
	infoCache.set(testToken, testUserInfo,  24*60*60*1000);
}

function validazioneRichiesta(req, serviceName) {
	var token;

	function getToken() { // => token
		var auth = req.headers.Authorization || req.headers.authorization;
		token = null;
		
		if (auth) {
			let splits = auth.split(' ');
			if (splits.length>=2 && splits[0]=='Bearer')
			token = splits[1];
		}
		if (token)
			return Promise.resolve(token);
		else
			return 	Promise.reject("la richiesta dovrebbe contenere l'header 'Authorization: Bearer <accessToken>'");
	}

	function validate(token) { // => decoded data
		console.log('TOKEN: '+token);
		tokenData = authCache.get(token);
		if (tokenData) {
			console.log('token già verificato');
			return tokenData;
		}
		return new Promise((resolve, reject) => {
			jwt.verify(token, oidcCertPem, function(err, decoded){
				if (err) {
					console.log('Validation KO', err);
					reject('errore nella validazione del token di accesso: '+err);		
				}
				else {
					console.log('Validation OK', JSON.stringify(decoded, null,2));
					var abilitato = decoded.scope.split(' ').indexOf(serviceName)>=0;
					if (!abilitato) 
						reject("accesso a '"+serviceName+"' non previsto nello scope del token");		
					else {
						authCache.set(token, decoded, 1000*60*60);
						resolve(decoded);
					}
				}
			});
		});
	}

	function userInfoFromToken(token) {
		var infoData = infoCache.get(token);
		if (infoData)
			return infoData;
	
		return axios({
			method:'get',
			url:'https://oidc-provider:3043/me',
			headers: {
				Authorization: 'Bearer '+token
			}
		})
		.then(response=>{
			//console.log("getUserInfo response", response);
			var userInfo = response.data;
			infoCache.set(token, userInfo, 1000*60*60);
			return userInfo;
		})
		.catch(error=>{
			console.log("getUserInfo error", error);
		})
	}

	function getAll(token) {
		return Promise.all([
			token,
			validate(token),
			userInfoFromToken(token)
		]);
	}
	
	function saveData([token, decoded, userInfo]) {
		req.accessToken = token;
		req.decodedAccessToken = decoded;
		req.userInfo = userInfo;
		return token;
	}

	function valida() {
		console.log('valida credenziali');
		if (req.headers["reset-authorization-cache"])  
			initCache();

		return getToken().then(getAll).then(saveData);
	}

	return valida();
}

init();
module.exports = validazioneRichiesta;