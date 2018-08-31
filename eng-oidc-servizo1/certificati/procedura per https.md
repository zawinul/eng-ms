* installare openssl e assicurarsi che openssl.exe sia raggiungibile tramite PATH
* creare il certificato (*eng-cert.pem*) e la chiave privata (*eng-key-encrypted.pem*). Verrà richiesta una passphrase di fantasia, annotarsela (es: *mypassphrase123*).

<pre>openssl.exe req -x509 -newkey rsa:2048 -keyout my-https-key-encrypted.pem -out my-https-cert.pem -days 3650</pre>
quando viene chiesta la passphrase dare una password (es: makkina19)

* la chiave criptata e il certificato possono essere usati per configurare il server https
<pre>

const express = require('express');
const http = require('http');
const https = require('https');

const sslOptions = {
	cert: fs.readFileSync('certificati/my-https-cert.pem'),
	key:  fs.readFileSync('certificati/my-https-key-encrypted.pem'),
	passphrase: 'mypassphrase123'
};
var app = express();
http.createServer(app).listen(80);
https.createServer(sslOptions, app).listen(443);</pre>

