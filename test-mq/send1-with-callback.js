var amqp = require('amqplib/callback_api');
var c; 

function onConnect(err, conn) {
	console.log('on connect');
	c = conn;
	conn.createChannel(onChannelCreated);
}


function onChannelCreated(err, ch) {
	console.log('on channel created');
	send(ch);
}

function send(ch) {
	var q = 'hello';

	ch.assertQueue(q, {durable: false});
	for(var i=0; i<10; i++) 
		ch.sendToQueue(q, new Buffer('Hello World! '+i));
}


function main() {
	amqp.connect(onConnect);
	setTimeout(function() { 
		c.close(); 
		console.log("bye!");
		process.exit(0) 
	}, 5000);	
}


main();