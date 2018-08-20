// const { MongoClient } = require('mongodb'); // eslint-disable-line import/no-unresolved

// const mongoURI = 'mongodb://localhost:27017/eng-ms';
// let DB;

// async function clear() {
// 	console.log('MONGO connect');
// 	const connection = await MongoClient.connect(mongoURI, {
// 		useNewUrlParser: true,
// 	});
// 	var DB = connection.db(connection.s.options.dbName);

// 	DB.collection('access_token').remove();
// 	DB.collection('authorization_code').remove();
// 	DB.collection('session').remove();
// }
