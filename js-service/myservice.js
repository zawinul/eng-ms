const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
	// application instance information
	instance: {
		app: 'my-ys-service',
		hostName: 'localhost',
		ipAddr: '127.0.0.1',
		port: {
			'$': 8050,
			'@enabled': 'true',
		},
	  
		vipAddress: 'it.eng.ms.js',
		dataCenterInfo: {
			'@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
			name: 'MyOwn',
		}
	},
	eureka: {
		// eureka server host / port
		host: '18.206.248.218',
		port: 8761,
		servicePath: '/eureka/apps/'
	},
});
client.logger.level('debug');
client.start();