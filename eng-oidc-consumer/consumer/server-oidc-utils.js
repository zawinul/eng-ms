const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const axios = require('axios');
const base64 = require('base-64');

const certPem = fs.readFileSync('certificati/oidc-provider-certificate.pem',{encoding:'UTF8'});
const STATEMARK = "f8d9v9d89d8f9s7fd9v9sj8f7"
function urlToSingleSignOn(client) {
	var x = Math.random();
	var nonce = base64.encode(Math.random()+"+"+(new Date()).getTime());
	var state = base64.encode(JSON.stringify({mark:STATEMARK, nonce: nonce, client:client }));
	var params = {
		client_id: client,
		response_type: 'code',
		//scope: 'openid',
		scope: 'openid profile email altro ',
		state: state,
		nonce: nonce, 
		redirect_uri: 'https://oidc-consumer:5043/callback'
	};
	var a=[];
	for(var k in params)
		a.push(k+'='+escape(params[k]));
	var url = 'https://oidc-provider:3043/auth?'+a.join('&');
	return url;
}

function askToken(code, client) {
	var params = {
		grant_type:"authorization_code",
		code: code, 
		response_type: "code", 
		redirect_uri:"https://oidc-consumer:5043/callback",
		scope: "openid email profile"
	};

	var auth = (client=='foo') ? 'foo:bar' : 'foo2:bar2';
	var p = axios({
		method: 'post',
		url: 'https://oidc-provider:3043/token', 
		data: querystring.stringify(params),
		headers: {
			Authorization: "Basic "+base64.encode(auth)
		}
	})
	.then(response=>{
		console.log('on received token', response);
		return Promise.all([
			userIdFromToken(response.data.id_token),
			userInfoFromToken(response.data.access_token)
		])
		.then(results => {
			return {
				userId: results[0],
				userInfo: results[1]
			}
		});
	})
	.catch(error=>console.log('error on get token', error));
	return p;
}

function userIdFromToken(idToken) {
	return tokenVerify(idToken, certPem);
}


function userInfoFromToken(accessToken) {
	return axios({
		method:'get',
		url:'https://oidc-provider:3043/me',
		headers: {
			Authorization: 'Bearer '+accessToken
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

function tokenVerify(token, pem) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, pem, function(err, decoded){
			if (err) {
				console.log('Validation KO', err);
				reject(err);		
			}
			else {
				var j = JSON.stringify(decoded, null, 2);
				console.log('token validated', err);
				resolve(decoded);
			}
		});
	});
}

module.exports = {
	askToken:askToken,
	urlToSingleSignOn: urlToSingleSignOn,
	stateMark: STATEMARK
};