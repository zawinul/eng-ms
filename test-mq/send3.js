var amqp = require('amqplib');
const NOME_EXCHANGE = 'esempio3';

function send(ch) {
	console.log('send '+!!ch);
	ch.assertExchange(NOME_EXCHANGE, 'fanout', {durable: true});
	var i=0;
	function sendOne() {
		//ch.sendToQueue(NOMECODA, new Buffer('Hello World! '+i), {persistent: true});
		ch.publish(NOME_EXCHANGE, '', new Buffer('Hello World! '+i));	
		i++;
		var t = Math.pow(4000, Math.random());
		setTimeout(sendOne, t);
	}
	sendOne();	
}

function main() {
	amqp.connect()
	.then(conn=> (c=conn).createChannel())
	.then(send);

	setTimeout(function() {
		c.close(); 
		console.log("bye!");
		process.exit(0) 
	}, 15000);	
}


main();