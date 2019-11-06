var amqp = require('amqplib');
var c; 
const NOMECODA = 'esempio1';

function send(ch) {
	console.log('send '+!!ch);

	ch.assertQueue(NOMECODA, {durable: true});
	for(var i=0; i<10000; i++) 
		ch.sendToQueue(NOMECODA, new Buffer('Hello World! '+i));
}


function main() {
	amqp.connect()
	.then(conn=>c=conn)
	.then(conn=>conn.createChannel())
	.then(send);

	setTimeout(function() {
		c.close(); 
		console.log("bye!");
		process.exit(0) 
	}, 1500);	
}


main();