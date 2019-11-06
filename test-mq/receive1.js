var amqp = require('amqplib');
var c;
const NOMECODA = 'esempio1';

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
	console.log(" [%d] Received %s", cnt++, msg.content.toString());
}
