
const engMsService = require('../eng-ms-js-service/engMsService.js');

async function main() {
	var cfg = {
		name: 'servizio1'
	};
	if (process.argv.length>2)
		cfg.instanceName = process.argv[2];
		
	const current = await engMsService.init(cfg);

	var pippoCount = 0;
	current.app.get('/pippo', function (req, res) {
		var message = `ciao, io sono ${current.instanceName}, questa è la richiesta #${pippoCount}`;
		pippoCount++;
		res.status(200).send(message);
	});

	current.app.get('/me', function (req, res) {
		res.status(200).send(
			JSON.stringify(req.userInfo, null, 2)
		);
	});

	current.logger.info('STARTED!!!');

}

main();