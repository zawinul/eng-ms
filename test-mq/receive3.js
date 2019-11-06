var amqp = require('amqplib');
var c;
const NOME_EXCHANGE = 'esempio3';

amqp.connect('amqp://localhost')
.then(conn=>c=conn)
.then(conn=>conn.createChannel())
.then(ch=>{
	ch.assertExchange(NOME_EXCHANGE, 'fanout', {durable: true})
	.then(() => ch.assertQueue('', {exclusive: true}))
	.then(q=>{
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", NOME_EXCHANGE);
		//ch.consume(NOME_EXCHANGE, onMessage, { noAck: true });
		ch.bindQueue(q.queue, NOME_EXCHANGE, '');
		ch.consume(q.queue, onMessage);
	})
});

var cnt=0;
function onMessage(msg) {
	var id = cnt++;
	console.log(" [%d] Received %s", id, msg.content.toString());
	setTimeout(function() {
		console.log("\t\t[%d] consumed %s", id, msg.content.toString());
	}, 2000+5000*Math.random());
}
