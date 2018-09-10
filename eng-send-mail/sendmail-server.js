console.log('SERVIZIO sendmail v 1.1');
const express = require('express');
const http = require('http');
const https = require('https');
const base64 = require('base-64');
const path = require('path');

const nodeoutlook = require('nodejs-nodemailer-outlook');
const PORT = 3900;


function send(subject, content, to, cc) {
	return new Promise(function(resolve, reject) {
		function realSend() {
			var x = {
				auth: {
					user: "paolo.andrenacci@eng.it",
					pass: "Spazio2000"
				}, 
				from: 'paolo.andrenacci@eng.it'
			};
			Object.assign(x, {subject, to, cc});
			if (content.trim().indexOf('<')==0)
				x.html = content;
			else
				x.text = content;
			console.log(JSON.stringify(x));
			try {
				nodeoutlook.sendEmail(x);
				resolve('OK');
			}
			catch(e) {
				reject(e);
			}	
		}

		// simula ritardo
		setTimeout(realSend, 5000)
	
	});
}

function validazioneRichiesta(req) {
	return Promise.resolve();
}

function prova() {
	nodeoutlook.sendEmail({
		auth: {
			user: "paolo.andrenacci@eng.it",
			pass: "Spazio2000"
		}, 
		from: 'paolo.andrenacci@eng.it',
		to: 'paolo.andrenacci@eng.it',
		subject: 'Hey you, awesome!',
		html: '<b>This is bold text</b>',
		text: 'This is text version!',
		attachments: [
			{
				filename: 'text1.txt',
				content: 'hello world!'
			},
			{   // binary buffer as an attachment
				filename: 'text2.txt',
				content: new Buffer('hello world!', 'utf-8')
			}
		]
	});	
}

// serve a fare in modo che nelle chiamate https siano accettati anche certificati autofirmati
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app;

function initExpress() {
	app = express();
	app.use(express.json());       // supporta JSON-encoded bodies
	app.use(express.urlencoded()); // supporta URL-encoded bodies
	http.createServer(app).listen(PORT);
	// validazione 
	app.use(function(req, res, next) {
		validazioneRichiesta(req, 'servizio1')
			.then(()=>{
				console.log('validazione ok');
				next();
			})  
			.catch(error=>{
				res.status(400).send(error);
			});
	});

}

var cnt = 1;
function routings() {

	app.post('/sync', function (req, res) {
		var { subject, content, to, cc} = req.body;
		try {
			send(subject, content, to, cc).then(()=>{
				res.status(200).send('OK');
			});
		}
		catch(e) {
			res.status(400).send('Error: '+e);
		}
	});	

	app.post('/async', function (req, res) {
		throw "not implemented"
	});

}


initExpress();
routings();
console.log('service started on http://eng-sendmail:'+PORT);
