const fs = require('fs');

const clients = [{
		client_id: 'foo',
		client_secret: 'bar',
		redirect_uris: [
			'https://oidc-consumer:5043/callback',
			'https://oidc-consumer:5043/callback-after-auth'
		],
		tokenEndpointAuthMethods:[ 
			//'none',
			'client_secret_basic',
			//'client_secret_jwt',
			'client_secret_post',
			//'private_key_jwt' 
		],
		__tokenEndpointAuthMethods: 'none',
		__tokenEndpointAuthMethods: 'client_secret_post'
	},
	{
		token_endpoint_auth_method: 'none',
		client_id: 'altro',
		client_secret: 'altro',
		grant_types: ['implicit'],
		response_types: ['id_token'],
		redirect_uris: ['https://oidc-consumer:5043/callback']
	  },
];

const configuration = {
	  formats: {
		default: 'opaque',
		AccessToken: 'jwt',
	  },
	  features: {
		claimsParameter: true,
		conformIdTokenClaims: true,
		discovery: true,
		encryption: true,
		introspection: true,
		registration: true,
		request: true,
		revocation: true,
		sessionManagement: true,
	  }
	
};

const sslOptions = {
	key: fs.readFileSync('certificati/eng-key.pem'),
	cert: fs.readFileSync('certificati/eng-cert.pem'),
	passphrase: 'makkina19'
};

module.exports = {
	clients: clients,
	configuration: configuration,
	sslOptions: sslOptions
}