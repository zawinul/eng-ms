const express = require('express');
const myData = require('../config-data');
const http = require('http');
const https = require('https');
const fs = require('fs');


var app = express();
app.use(express.static('consumer/static'));

http.createServer(app).listen(5000);
https.createServer(myData.sslOptions, app).listen(5043);

app.get('/callback', function (req, res) {
	var html = fs.readFileSync('consumer/static/callback.html',{encoding:'UTF8'});

	var h = [];
	h.push('<b>' + req.originalUrl + '</b><br><br>\n');
	for (var k in req.query)
		h.push('<b style="color:#800000">' + k + ' : ' + req.query[k] + '</b>');

	// h.push('');
	// for (var k in req.headers)
	// 	h.push(k + ' : ' + req.headers[k]);

	html = html.replace('__INFO__', h.join('<br>\n'));
	res.send(html);
});




console.log('CONSUMER: go to https://oidc-consumer:5043/home');
module.exports = {}