var events = ['server_error',
'authorization.accepted',
'interaction.started',
'interaction.ended',
'authorization.success',
'authorization.error',
'grant.success',
'grant.error',
'certificates.error',
'discovery.error',
'introspection.error',
'revocation.error',
'registration_create.success',
'registration_create.error',
'registration_read.error',
'registration_update.success',
'registration_update.error',
'registration_delete.success',
'registration_delete.error',
'userinfo.error',
'check_session.error',
'check_session_origin.error',
'end_session.success',
'end_session.error',
'webfinger.error',
'token.issued',
'token.consumed',
'token.revoked',
'grant.revoked',
'backchannel.success',
'backchannel.error'];

function attachEvents(obj) {
	events.map(x=>f(x,obj));
}

function f(evName, obj) {
	obj.on(evName, function(){
		var a = [evName];
		for(var i=0; i<arguments.length-1; i++) 
			a.push(argumentss[i]);
	
		console.log('\t',a);
		//return true;
	});
}


module.exports = attachEvents;