console.log('CONSUMER v 1.1');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const oidc = require('./server-oidc-utils');
const base64 = require('base-64');

// serve a fare in modo che nelle chiamate https siano accettati anche certificati autofirmati
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static('consumer/static'));

http.createServer(app).listen(5000);
var sslOptions = {
	cert: fs.readFileSync('certificati/my-https-cert.pem'),
	key:  fs.readFileSync('certificati/my-https-key-encrypted.pem'),
	passphrase: 'AWZXH2424-K8'
};

https.createServer(sslOptions, app).listen(5043);

// app.get('/OLD-callback', function (req, res) {
// 	var html = fs.readFileSync('consumer/static/callback.html',{encoding:'UTF8'});

// 	var h = [];
// 	h.push('<b>' + req.originalUrl + '</b><br><br>\n');
// 	for (var k in req.query)
// 		h.push('<b style="color:#800000">' + k + ' : ' + req.query[k] + '</b>');

// 	html = html.replace('__INFO__', h.join('<br>\n'));
// 	res.send(html);
// });

app.get('/do-login', function (req, res) {
	var url = oidc.urlToSingleSignOn('foo');
	console.log('redirecting to '+url);
	res.redirect(url);
});


app.get('/do-login2', function (req, res) {
	var url = oidc.urlToSingleSignOn('foo2');
	console.log('redirecting to '+url);
	res.redirect(url);
});

app.get('/callback', function (req, res) {
	var code = req.query.code;
	var state = JSON.parse(base64.decode(req.query.state));
	if (state.mark!=oidc.stateMark)
		throw "errore nello stato ritornato";
	var p = oidc.askToken(code, state.client);
	p.then(data=>{
		if (data.userId.nonce!=state.nonce)
			throw "errore nello stato ritornato";
		var msg = JSON.stringify(data, null,2);
		res.send("<html><body><pre>"+msg+"</pre></body></html>");
		return data;
	}).catch(error=>{
		res.send("ERROR: "+JSON.stringify(error));
	});
});

// app.post('/token-verify', function (req, res) {
// 	var token = req.body['token'];
// 	var certPem = fs.readFileSync('certificati/eng-cert.pem',{encoding:'UTF8'});
// 	jwt.verify(token, certPem, function(err, decoded){
// 		if (err) {
// 			console.log('KO', err);
// 			res.send('KO: '+err);		
// 		}
// 		else {
// 			var j = JSON.stringify(decoded, null, 2);
// 			console.log('OK', err);
// 			res.send('OK: '+j);
// 		}
// 	});
// });

console.log('CONSUMER: go to https://oidc-consumer:5043/');
module.exports = {}