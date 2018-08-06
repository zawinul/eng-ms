var express = require('express');
var bodyParser = require('body-parser');
var OAuthServer = require('./express-oauth');

var Request = require('oauth2-server').Request;
var Response = require('oauth2-server').Response;
var prove = require('./prove');

var app = express();
var port = 3000;

var model = require('./model-memory'); 
var m = new model();
//var m = require('./model').model;

var server = new OAuthServer({
	model: m
});
app.oauth = server;

console.log(!!m.getClient);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/oauth/token', app.oauth.token());

app.get('/oauth/authorize', app.oauth.authorize());

app.get('/secret', app.oauth.authorize(), function (req, res) {
	// Will require a valid access_token.
	res.send('Secret area');
});

//app.use(app.oauth.authorize());
 

app.get('/public', function (req, res) {
	res.send('Public area');
});


 
app.listen(port);
console.log('started at port '+port);

//prove(server.server);