

(function(){

function _init() {
	if (!engapp.util)
		engapp.util = {};
	var df = /*engapp.dateFormat = */ 'YYYYMMDDHHmmss';
	engapp.util.stringToMoment = function(x) { return moment(x, df); }
	engapp.util.stringToDate = function(x) { return moment(x, df); }
	engapp.util.momentToString = function(x) { return x.format(df);}
	engapp.util.dateToString = function(x) { return moment(x).format(df);}
}


function n(callback) { // evita di testare se una callback è null
	return callback || function(){};
}

function ajax(op, params, callback) {
	//engapp.pushWait();
	return $.ajax("ajax/"+op,{
		method:(params)?'POST':'GET',
		dataType:'JSON',
		data:(params)?JSON.stringify(params):undefined,
		success:function(data) {
			//engapp.popWait();
			console.log({op:op, lastAjax:data})
			n(callback)(data);
		},
		error: function() {
			console.log({ajaxError:arguments});
			//engapp.popWait();
		}
	});
}




var config = null;
ajax.getConfig = function() {

	if (!config) {
		/*
		config = $.Deferred();
		engapp.ajax('session/getConfig', {}, function(response){
			config.resolve(response.config);
		});
		*/
		config = Promise.resolve({});
	}
	return config;
}


engapp.ajax = ajax;
engapp.onStart(_init);
	
})();
