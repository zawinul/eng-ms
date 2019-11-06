$(function(){
	oidc.getAccessToken().then(function(token){
		$('.ok').show();
		$('.invia').click(invia);
	});

	function invia() {
		var rr = $('#rr').val();
		camunda.sendMessageByCorrelation('ricevutaRitornoArrivata', {reconciliationId:rr}, {fonteRR:'web'})
		.then(function(obj){
			$('.dump').text(JSON.stringify(obj, null,2));
		})
	}
});

