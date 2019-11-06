$(function(){
	oidc.getAccessToken().then(function(token){
		$('.ok').show();
		$('.procedi').click(procedi);
	});


	function procedi() {
		var fields = {
			mittente: $('.mittente').val(),
			destinatario: $('.destinatario').val(),
			oggetto: $('.oggetto').val(),
			testo: $('.testo').val(),
		};

		camunda.startProcessByName('invio_R3', 'BK'+Math.random(), fields).then(function(x) {
			$('.dump').text(JSON.stringify(x, null,2));
		});
	}
});

