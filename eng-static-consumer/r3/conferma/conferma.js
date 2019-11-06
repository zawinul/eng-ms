(function(){

	var params;
	var saved;
	function init() {
		params = getUrlParams(location.href);
		$('.params-ko').show();

		camunda.getActivityList(params.id).then(
			function(activityList){
				console.log({activityList:activityList});

				acts = activityList.childActivityInstances.filter(function(a){
					return a.name=='aspetta conferma'
				});
				if (acts.length==0)
					$('.error-message').text("la pratica non è in attesa di conferma");
				else
					avvia();
			},
			function(){
				$('.error-message').text("l'oggetto non esite, forse è scaduto");
			}
		);
		
		function avvia() {
			procInfo();

			camunda.getInstanceVariables(params.id).then(function(vars){
				$('.params-ok').show();
				saved = {
					mittente: vars.mittente.value,
					oggetto: vars.oggetto.value,
					destinatario: vars.destinatario.value,
					testo: vars.testo.value	
				};
				$('.mittente').val(vars.mittente.value);
				$('.oggetto').val(vars.oggetto.value);
				$('.destinatario').val(vars.destinatario.value);
				$('.testo').val(vars.testo.value);
				
				$('.accetta').click(onAccetta);
				$('.modifica').click(onModifica);
				$('.rifiuta').click(onRifiuta);
				$('input, textarea').on('change keyup keypress blur click', enableButtons);
	
				enableButtons();
				showJSON(vars);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log({getInstanceVariablesError:jqXHR});
				var notFound = [400,404,500].indexOf(jqXHR.status)>=0;
				$('.params-ko').show();
				$('.error-message').text(notFound?"l'oggetto non esite, forse è scaduto":'ERROR '+jqXHR.status);
				showJSON(jqXHR);
			});
	
		}

		function procInfo() {
			camunda.getInstanceProcess(params.id).then(function(proc){
				var info = "Proc: name=\""+proc.name+"\", version:"+proc.version+" description:"+proc.description;
				$('.process-info').text(info);
				console.log({getInstanceProcess:proc});
				camunda.getDeployment(proc.deploymentId).then(function(deployment){
					var info = "Deployment: name=\""+deployment.name+"\", time:"+deployment.deploymentTime;
					$('.deployment-info').text(info);
					console.log({getDeployment:deployment});	
				});
			});
		}
	}

	function changed() {
		return ($('.mittente').val()!=saved.mittente)
			|| ($('.destinatario').val()!=saved.destinatario)
			|| ($('.oggetto').val()!=saved.oggetto)
			|| ($('.testo').val()!=saved.testo);
	}

	function enableButtons() {
		$('.accetta, .modifica').removeClass('isDisabled');

		if (changed())
			$('.accetta').addClass('isDisabled');
		else
			$('.modifica').addClass('isDisabled');
	}


	function onModifica() {
		if (!changed())
			return;

		var fields = {
			mittente: $('.mittente').val(),
			oggetto: $('.oggetto').val(),
			destinatario: $('.destinatario').val(),
			testo: $('.testo').val(),
			esitoConferma: 'changed'
		}
		camunda.sendMessageToProcess('confermaArrivata', params.id, fields).then(showJSON);
	}
	
	function showJSON(x) {
		$('.dump').text(JSON.stringify(x,null,2));
	}
	
	function onAccetta() {
		if (changed())
			return;
		var fields = {
			esitoConferma: 'ok'
		};
		camunda.sendMessageToProcess('confermaArrivata', params.id, fields).then(showJSON);
	}
	
	function onRifiuta() {
		var fields = {
			esitoConferma: 'ko'
		};
		camunda.sendMessageToProcess('confermaArrivata', params.id, fields).then(showJSON);
	}

	$(init);
})();



