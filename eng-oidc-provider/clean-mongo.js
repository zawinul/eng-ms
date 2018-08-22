const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'eng-ms';
var client, db;
function ignoraErrore() {}
// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true })
.then(x=>{ client = x; return client.db(dbName);})
.then(x=>{ 
	db = x;
	return db.collection('access_token').drop().catch(ignoraErrore)
		.then(()=>db.collection('authorization_code').drop().catch(ignoraErrore))
		.then(()=>db.collection('session').drop().catch(ignoraErrore))
})
.then(()=>client.close())
.then(()=>console.log('done'))
.catch(error=>console.log('ERROR!', error));
