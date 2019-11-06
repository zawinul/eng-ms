var amqp = require('amqplib');
const RPC_QUEUE = 'esempio6';
const RETURN_QUEUE = 'return-12-34-56';

var seed=0;
var listenerMap = {}

function send(ch) {
	console.log('send '+!!ch);
	var receiveQueue;
	//ch.assertExchange(NOME_EXCHANGE, 'fanout', {durable: true});
	ch.assertQueue(RETURN_QUEUE, {exclusive: true})
	.then(q =>  {
		receiveQueue = q;
		console.log("my queue is "+receiveQueue.queue);
		ch.consume(receiveQueue.queue, onMessage);

		console.log("*** START ***");
		sendOne();	
	});
	
	function sendOne() {
		var corr = 'CORR-'+(seed++);
		var v = seed;
		console.log("ask " + v);
		ch.sendToQueue(RPC_QUEUE, new Buffer(v.toString()),{ 
			correlationId: corr,
			replyTo: receiveQueue.queue
		});
		listenerMap[corr] = function(msg) {
			console.log("    [%s] il quadrato di %d è %s", corr, v, msg.content.toString());
		}
		var t = 200+Math.pow(1500, Math.random());
		setTimeout(sendOne, t);
	}
}

function onMessage(msg) {

	var corr =  msg.properties.correlationId;
	var fun = listenerMap[corr];
	if (!fun)
		console.log("    MESSAGGIO INATTESO corr=%s", msg.properties.correlationId);
	else {
		fun(msg);
		delete listenerMap[corr];
	}
}


function main() {
	amqp.connect()
	.then(conn=> (c=conn).createChannel())
	.then(send);

	// setTimeout(function() {
	// 	c.close(); 
	// 	console.log("bye!");
	// 	process.exit(0) 
	// }, 60000);	
}


main();