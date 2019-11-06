var amqp = require('amqplib');
const RPC_QUEUE = 'esempio6';
var ch;

amqp.connect('amqp://localhost')
.then(conn=>c=conn)
.then(conn=>conn.createChannel())
.then(channel=>{
	ch = channel;
	ch.assertQueue(RPC_QUEUE, {durable: false});
	//ch.prefetch(1);
	console.log(' [x] Awaiting RPC requests');
    ch.consume(RPC_QUEUE, onMessage);
});

var cnt=0;
function onMessage(msg) {
	var id = cnt++;
	console.log("[%d] Received %s corr=%s", id, msg.content.toString(), msg.properties.correlationId);
	var t = Math.random()*30000+500;
	setTimeout(function() {
		console.log("          [%d] reply c=%s ", id, msg.properties.correlationId);
		var v = msg.content.toString()-0;
		var q = v*v;
		ch.sendToQueue(msg.properties.replyTo,
			new Buffer(q.toString()),
			{correlationId: msg.properties.correlationId});
	
		ch.ack(msg);
	
	}, t);
}
