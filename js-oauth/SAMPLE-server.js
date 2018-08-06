const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const AccessDeniedError = require('oauth2-server/lib/errors/access-denied-error');

//let request = new Request({/*...*/});
//let response = new Response({/*...*/});


const oauth = new OAuth2Server({
	model: require('./model')
});


function autorizza() {
	oauth.authorize(request, response)
		.then((code) => {
			// The resource owner granted the access request.
		})
		.catch((err) => {
			if (err instanceof AccessDeniedError) {
				// The resource owner denied the access request.
			} else {
				// Access was not granted due to some other error condition.
			}
		});
}

function autentica() {
	oauth.authenticate(request, response)
		.then((token) => {
			// The request was successfully authenticated.
		})
		.catch((err) => {
			// The request failed authentication.
		});
}

function token() {
	oauth.token(request, response)
		.then((token) => {
			// The resource owner granted the access request.
		})
		.catch((err) => {
			// The request was invalid or not authorized.
		});
}