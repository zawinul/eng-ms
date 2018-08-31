console.log('this is main...');


//process.env.DEBUG = 'oidc-provider:*'; // dovrebbe loggare oidc
process.env.DEBUG = '*'; // dovrebbe loggare tutto
require('./provider/provider');

