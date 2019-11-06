var camunda = (function(){
	var defaultConfig = {
		engine: 'default',
		serverUrl:'https://eng-workflow:8080/rest/engine/',
		access_token: null,
		error: function(jqXHR, textStatus) {
			console.log("Ajax Error, "+textStatus);
		}
	}
	var config  = $.extend({}, defaultConfig);

	function call(method, resource, callCfg) {
		var ret = $.Deferred();
		oidc.getAccessToken().then(function(access_token) {
			var c = $.extend({},callCfg||{});
			c.url = config.serverUrl+config.engine+'/'+resource;
			c.method = method;
			c.headers = c.headers || {};
			c.headers.Authorization = "Bearer "+access_token;
			if (!c.error)
				c.error = config.error;
			$.ajax(c).then(
				function(data, textStatus, jqXHR ){
					ret.resolve(data);
				},
				function(jqXHR, textStatus, errorThrown) {
					console.log({ajaxError:{url:c.url, jqXHR:jqXHR}});
					ret.reject(jqXHR, textStatus, errorThrown)
				}
			);
		});

		return ret;
	}

	function get(resource, callCfg) {
		return call('GET', resource, callCfg);
	}

	function post(resource, callCfg) {
		return call('POST', resource, callCfg);
	}

	function getInstanceVariables(id) {
		return get('process-instance/'+id+'/variables/');
	}

	function getInstance(id) {
		return get('process-instance/'+id);
	}

	function getDeployment(id) {
		return get('deployment/'+id);
	}

	function getHistory(id) {
		return get('history/activity-instance?sortBy=startTime&sortOrder=asc&processInstanceId='+id);
	}

	function getInstanceProcess(id) {
		return get('process-instance/'+id)
		.then(function(instance){
			return get('process-definition/'+instance.definitionId);
		});
	}

	// function _getInstanceProcess(id) {
	// 	var r = $.Deferred();
	// 	var x=get('process-instance/'+id);
	// 	x.then(function(instance) {
	// 		var y = get('process-definition/'+instance.definitionId);
	// 		y.then(function(process) {
	// 			r.resolve(process);
	// 		}); 
	// 	});
	// 	return r;
	// }
	
	function getInstanceList() {
		return get('process-instance');
	}

	function getActivityList(id) {
		return get('process-instance/'+id+'/activity-instances');
	}

	function getProcessLatestVersion(processName) {
		return get("process-definition/key/"+processName);
	}

	function startProcessByName(processName, businessKey, params) {
		if(!businessKey)
			businessKey = "BK"+Math.random();
			
		var d = {
			businessKey: businessKey,
			variables:{	}
		};
		for(var k in params) {
			d.variables[k] ={
				type: 'string',
				value: params[k]
			};
		}
		return post("process-definition/key/"+processName+'/start', {
			data:JSON.stringify(d,null,2),
			contentType:'application/json'
		});
	}

	function sendMessageToProcess(message, processId, data) {
		var d = {
			messageName: message,
			processInstanceId: processId, 
			all:true,
			resultEnabled: true
		};
		if (data) {
			d.processVariables = {};
			for (var k in data) {
				d.processVariables[k] = {
					value: data[k].toString(),
					type:'string'
				}
			}
		}
		//console.log(JSON.stringify(d,null,2));

		return post('message', {
			data:JSON.stringify(d,null,2),
			contentType:'application/json'
		});
	}

	
	function sendMessageByCorrelation(message, map, data) {
		var d = {
			messageName: message,
			all:true,
			resultEnabled: true,
			correlationKeys: {}
		};
		for(var k in map) {
			d.correlationKeys[k] = {
				value: map[k],
				type:'string'
			}
		}

		if (data) {
			d.processVariables = {};
			for (var k in data) {
				d.processVariables[k] = {
					value: data[k].toString(),
					type:'string'
				}
			}
		}
		//console.log(JSON.stringify(d,null,2));

		return post('message',{
			data:JSON.stringify(d,null,2),
			contentType:'application/json'
		});
	}


	function example() {
		camunda.getInstanceList()
		.then(x=>x[0].id)
		.then(camunda.getActivityList)
		.then(x=>console.log(JSON.stringify(x, null, 2)))
	}

	return {
		//init: init,
		getInstance:getInstance,
		getInstanceVariables:getInstanceVariables,
		getInstanceProcess: getInstanceProcess,
		getInstanceList:getInstanceList,
		getActivityList: getActivityList,
		getDeployment: getDeployment,
		getProcessLatestVersion:getProcessLatestVersion,
		sendMessageToProcess: sendMessageToProcess,
		sendMessageByCorrelation: sendMessageByCorrelation,
		startProcessByName: startProcessByName,
		example: example
	}
})();