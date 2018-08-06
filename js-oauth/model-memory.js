
/**
 * Constructor.
 */

function InMemoryCache() {
	this.clients = [{ 
		clientId: 'thom', 
		clientSecret: 'nightworld', 
		redirectUris: ['http://www.repubblica.it'],
		grants:['read', 'write', 'authorization_code']
	}];
	this.tokens = [];
	this.users = [{ 
		id: '123', 
		username: 'thomseddon', 
		password: 'nightworld' 
	}];
}



InMemoryCache.prototype.dump = function () {
	console.log('clients', this.clients);
	console.log('tokens', this.tokens);
	console.log('users', this.users);
};

/*
 * Get access token.
 */

InMemoryCache.prototype.getAccessToken = function (bearerToken) {
	console.log('InMemoryCache.getAccessToken');
	var tokens = this.tokens.filter(function (token) {
		return token.accessToken === bearerToken;
	});

	return tokens.length ? tokens[0] : false;
};

/**
 * Get refresh token.
 */

InMemoryCache.prototype.getRefreshToken = function (bearerToken) {
	console.log('InMemoryCache.getRefreshToken');
	var tokens = this.tokens.filter(function (token) {
		return token.refreshToken === bearerToken;
	});

	return tokens.length ? tokens[0] : false;
};

/**
 * Get client.
 */

InMemoryCache.prototype.getClient = function (clientId, clientSecret) {
	console.log('InMemoryCache.getClient');
	var clients = this.clients.filter(function (client) {
		return client.clientId === clientId /* && client.clientSecret === clientSecret*/;
	});

	return clients.length ? clients[0] : false;
};

/**
 * Save token.
 */

InMemoryCache.prototype.saveToken = function (token, client, user) {
	console.log('InMemoryCache.saveToken');
	this.tokens.push({
		accessToken: token.accessToken,
		accessTokenExpiresAt: token.accessTokenExpiresAt,
		clientId: client.clientId,
		refreshToken: token.refreshToken,
		refreshTokenExpiresAt: token.refreshTokenExpiresAt,
		userId: user.id
	});
};

/*
 * Get user.
 */

InMemoryCache.prototype.getUser = function (username, password) {
	console.log('InMemoryCache.getUser');
	var users = this.users.filter(function (user) {
		return user.username === username && user.password === password;
	});

	return users.length ? users[0] : false;
};

// PAOLO
InMemoryCache.prototype.saveAuthorizationCode = function (code, client, user, callback) {
	console.log('InMemoryCache.saveAuthorizationCode');
	return new Promise('works!');
}

module.exports = InMemoryCache;
