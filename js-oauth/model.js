var Promise = require("bluebird");

var mytokens = [];

function saveAuthorizationCode(code, client, user, callback) {
	console.log('saveAuthorizationCode');
	return new Promise('works!');
}

function getAuthorizationCode(code, client, user/* , callback */) {
	console.log('getAuthorizationCode');
	return new Promise('works!');
}

function getClient (clientId, clientSecret, callback ) {
	console.log('getClient id='+clientId+' s='+clientSecret);
	var client = {
		id: 'pippo',		//	String	A unique string identifying the client.
		redirectUris: ['http://127.0.0.1:2002'],	//	Array<String>	Redirect URIs allowed for the client. Required for the authorization_code grant.
		grants:['read', 'write', 'authorization_code'], 
		//	Array<String>	Grant types allowed for the client.
		accessTokenLifetime: 3600, //	Number	Client-specific lifetime of generated access tokens in seconds.
		refreshTokenLifetime:3600	//	Number	Client-specific lifetime of generated refresh tokens in seconds.
	};
	//return new Promise(client);
	callback(null, client);
}

function getUser(username, password /* , callback */) {
	console.log('getUser');
	return new Promise('works!');
}

function getUserFromClient(client /* , callback */) {
	console.log('getUser');
	return new Promise('works!');

}

function getAccessToken(bearerToken /* ,  callback */) {
	console.log('getAccessToken');
	var tokens = mytokens.filter(function (token) {
		return token.accessToken === bearerToken;
	});

	var ret = tokens.length ? tokens[0] : false;
	console.log('getAccessToken', ret);
	return ret;

}

function saveToken(token, client, user /* ,  callback */) {
	console.log('saveToken');
	return new Promise('works!');
}

function revokeToken(token /* ,  callback */) {
	console.log('revokeToken');
	return new Promise('works!');
}

function revokeAuthorizationCode(code /* ,  callback */) {
	console.log('revokeAuthorizationCode');
	return new Promise('works!');
}

function verifyScope(accessToken, scope /* ,  callback */) {
	console.log('verifyScope');
	return new Promise('works!');
}

exports.model = {
	getAccessToken:getAccessToken,
	getAuthorizationCode:getAuthorizationCode,
	saveAuthorizationCode:saveAuthorizationCode,
	getClient:getClient,
	getUser:getUser,
	getUserFromClient:getUserFromClient,
	saveToken:saveToken,
	revokeToken:revokeToken,
	revokeAuthorizationCode:revokeAuthorizationCode,
	verifyScope:verifyScope
};