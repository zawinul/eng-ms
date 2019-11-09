ENG-OID-PROVIDER  
---

* doc: [https://github.com/panva/node-oidc-provider/blob/master/docs/README.md](https://github.com/panva/node-oidc-provider/blob/master/docs/README.md)
* dipende da mongo  
* start con  C:\Workspace\eng-ms\eng-oidc-provider\provider-start.bat  
* start.bat fa partire main.js su node  
* main lancia ./provider/provider  
* legge la configurazione in config/provider-configuration.json


		{
			"formats": {
				"default": "opaque",
				"AccessToken": "jwt"
			},
			"features": {
				"devInteractions": false,
				"claimsParameter": true,md
				"conformIdTokenClaims": true,
				"discovery": true,
				"encryption": true,
				"introspection": true,
				"registration": true,
				"request": true,
				"revocation": true,
				"sessionManagement": true
			},
			"claims": {
				"openid": [
					"sub"
				],
				"email": [
					"email",
					"email_verified"
				],
				"profile": [
					"organigramma",
					"abilitazioni"
				],
				"dati_applicativi": [
					"organigramma",
					"abilitazioni"
				],
				"altro": [
					"altro",
					"altro_ancora"
				],
				"workflow":[
					"camunda_id"
				],
				"servizio1": [],
				"servizio2": [],
				"servizio3": [],
				"servizio4": [],
				"servizio5": [],
				"servizio6": [],
				"servizio7": [],
				"servizio8": [],
				"servizio9": [],
				"servizio10": []
			},
			"logoutSource": "logoutSource",
			"postLogoutRedirectUri": "postLogoutRedirectUri",
			"cookies": {
				"keys": [
					"pippo8768783204958304598",
					"pluto9058946740587529348",
					"paperino050344027692846598"
				]
			}
		}

* alla configurazione vengono aggiunti:

		findById: Account.findById,
		logoutSource: logoutSource,
		postLogoutRedirectUri: postLogoutRedirectUri,
		interactionCheck: async function(ctx) { return false; }  

    * (Account è un finto db degli utenti mappato in memoria e cablato nel codice)  
	* (logoutSource è la pagina di logout compilata a partire dal template provider/views/logout.ejs)  
	* (postlogoutRedirectUri è una routine che calcola l'url di postLogout a partire dal contesto)
* viene startato un https web server che utilizza express e helmet, i certificati sono nella directory certificati
* il vebserver viene salvato nella variabile app
* il webserver aggiunge i seguenti 'use'  
	
	* /post-logout
		
		pagina di addio, con parametri in base64 per eventuale pagina di ritorno
	* /interaction/:grant'
	* /interaction/:grant/confirm 
	* /interaction/:grant/login
	* /genera-token (da usare solo per debug)
* il provider viene avviato con

			oidc = new Provider('https://oidc-provider:3043', configuration);
			oidc.initialize({
				clients: clients,
				keystore: keystore,
				adapter: mongoAdapter
			});
* il provider viene salvato nella variabile oidc
* il provider viene agganciato al webserver tramite

		app.use('/', oidc.callback);




URL: http://127.0.0.1:3000/....  

URL per info: [https://oidc-provider:3043/.well-known/openid-configuration](https://oidc-provider:3043/.well-known/openid-configuration)  
la logica per trovare gli utenti è in in account.js
*paolo/aaa*  
*pippo/bbb*  
I "client" sono configurati in clients.json