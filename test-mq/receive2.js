var amqp = require('amqplib');
var c;
const NOMECODA = 'esempio2';

amqp.connect('amqp://localhost')
.then(conn=>c=conn)
.then(conn=>conn.createChannel())
.then(ch=>{
	ch.assertQueue(NOMECODA, { durable: true });
	console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", NOMECODA);
	ch.consume(NOMECODA, onMessage, { noAck: true });
});

var cnt=0;
function onMessage(msg) {
	var id = cnt++;
	console.log(" [%d] Received %s", id, msg.content.toString());
	setTimeout(function() {
		console.log("\t\t[%d] consumed %s", id, msg.content.toString());
	}, 2000+5000*Math.random());
}
