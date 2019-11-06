var amqp = require('amqplib');
const NOME_EXCHANGE = 'esempio4';

function send(ch) {
	console.log('send '+!!ch);
	//ch.assertExchange(NOME_EXCHANGE, 'fanout', {durable: true});
	ch.assertExchange(NOME_EXCHANGE, 'direct', {durable: false});
	var i=0;
	function sendOne() {
		//ch.sendToQueue(NOMECODA, new Buffer('Hello World! '+i), {persistent: true});
		var direction = ['left', 'right', 'both', 'none'][Math.floor(Math.random()*4)];
		console.log("sending msg to "+direction);
		ch.publish(NOME_EXCHANGE, direction, new Buffer('Hello '+i+' '+direction));	
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