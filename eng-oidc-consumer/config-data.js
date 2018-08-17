const fs = require('fs');

const clients = [{
		client_id: 'foo',
		client_secret: 'bar',
		redirect_uris: [
			'https://oidc-consumer:5043/callback',
			'https://oidc-consumer:5043/callback-after-auth'
		],
		tokenEndpointAuthMethods:[ 
			'none',
			'client_secret_basic',
			'client_secret_jwt',
			'client_secret_post',
			'private_key_jwt' 
		],
		___tokenEndpointAuthMethods:'client_secret_basic'
	}
];

const sslOptions = {
	key: fs.readFileSync('certificati/eng-key-encrypted.pem'),
	cert: fs.readFileSync('certificati/eng-cert.pem'),
	passphrase: 'makkina19'
};

module.exports = {
	clients: clients,
	sslOptions: sslOptions
}