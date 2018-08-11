const Provider = require('oidc-provider');
const myData = require('../config-data');

var conf = myData.configuration;

const oidc = new Provider('http://oidc-provider:3000', conf);

conf.findById = function(ctx, id) {
	return {
		accountId: id,
		async claims(use, scope) { return { sub: id }; },
	};
}

oidc.initialize({ clients: myData.clients })
	.then(() => {
		oidc.listen(3000);
		console.log('oidc-provider listening on port 3000,\ncheck http://oidc-provider:3000/.well-known/openid-configuration');
	})
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
	});

module.exports = {}