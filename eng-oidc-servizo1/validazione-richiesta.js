var LRU = require("lru-cache");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const oidcCertPem = fs.readFileSync('certificati/oidc-provider-certificate.pem',{encoding:'UTF8'});
const axios = require('axios');

var authCache = LRU(1000), infoCache = LRU(1000);


function validazioneRichiesta(req, serviceName) {
	console.log('valida credenziali');
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
			console.log('tokenData già presente');
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
					else
						resolve(decoded);
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
			console.log("getUserInfo response", response);
			return response.data;
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
		authCache.set(token, decoded, 1000*60*60);
		infoCache.set(token, userInfo, 1000*60*60);
		req.accessToken = token;
		req.decodedAccessToken = decoded;
		req.userInfo = userInfo;
		return token;
	}


	return getToken().then(getAll).then(saveData);

}


module.exports = validazioneRichiesta;