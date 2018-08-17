* installare openssl e assicurarsi che openssl.exe sia raggiungibile tramite PATH
* creare il certificato (*eng-cert.pem*) e la chiave privata (*eng-key-encrypted.pem*). Verrà richiesta una passphrase di fantasia, annotarsela (es: *mypassphrase123*).

<pre>openssl.exe req -x509 -newkey rsa:2048 -keyout eng-key-encrypted.pem -out eng-cert.pem -days 3650</pre>
quando viene chiesta la passphrase dare una password (es: makkina19)

* la chiave criptata e il certificato possono essere usati per configurare il server https
<pre>

const express = require('express');
const http = require('http');
const https = require('https');

const sslOptions = {
	key: fs.readFileSync('...eng-key-encrypted.pem'),
	cert: fs.readFileSync('...eng-cert.pem'),
	passphrase: 'mypassphrase123'
};
var app = express();
http.createServer(app).listen(80);
https.createServer(sslOptions, app).listen(443);</pre>

* per poter usare la chiave privata in oic-provider occorre inserirla in un JWK-set. Adopereremo la libreria node-jose. Occorre però fornire la chiave privata non criptata (*eng-key-unencrypted.pem*) che si ottiene con
<pre>openssl rsa -in eng-key-encrypted.pem -out eng-key-unencrypted.pem</pre>

* per ottenere il JWKset in un keystore lanciare <br>`node crea-keystore`<br> che creerà i file json *keystore-private*, *keystore-public* e *keystore_both* (che contengono rispettivamente certificato, chiave, entrambi).

* il file keystore-private può essere usato per configurare oidc-server
<pre>var configuration = {
	.....
};
const keystore = require('....keystore-private.json');
const oidc = new Provider('https://oidc-provider:3043', configuration);
oidc.initialize({
	clients: .....,
	keystore: keystore,
	adapter: .....,
	.....
})
</pre>

* i file *eng-key-encrypted.pem*, *keystore-private*  e *keystore_both* contengono la chiave privata in chiaro, sarebbe meglio cancellarli alla fine della procedura. Il file *keystore-private* può essere cablato dentro al codice (è un json) per non tenere il file sul disco
