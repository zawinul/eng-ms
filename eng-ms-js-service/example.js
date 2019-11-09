
const engMsService = require('./engMsService.js');

async function main() {
	const current = await engMsService.init('MSENG_EXAMPLE', 6000, 6050);

	current.app.get('/pippo', function (req, res) {
		res.status(200).send('ciao pippo');
	});

	current.app.get('/me', function (req, res) {
		res.status(200).send(
			JSON.stringify(req.userInfo, null, 2)
		);
	});

	current.logger.info('STARTED!!!');

}

main();