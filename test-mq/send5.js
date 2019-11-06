var amqp = require('amqplib');
const NOME_EXCHANGE = 'esempio5';

function send(ch) {
	console.log('send '+!!ch);
	//ch.assertExchange(NOME_EXCHANGE, 'fanout', {durable: true});
	ch.assertExchange(NOME_EXCHANGE, 'topic', {durable: false});
	var i=0;
	function sendOne() {
		var area = [
			["italia", "estero"][Math.floor(Math.random()*2)],
			["prodotti", "servizi", "consulenza"][Math.floor(Math.random()*2)],
			["commerciale", "delivery", "tecnica"][Math.floor(Math.random()*2)]
		];
		var key = area.join('.');
		console.log("sending msg to "+key);
		ch.publish(NOME_EXCHANGE, key, new Buffer('Hello '+i+' '+key));	
		i++;
		var t = Math.pow(1500, Math.random());
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
	}, 60000);	
}


main();