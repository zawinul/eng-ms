const uuidv1 = require('uuid/v1');
const crypto = require('crypto');

const MYHASHKEY='UYSfGDfCeUhGV6Yy7U3YFvUYGUD6YG3DUdYDGUYGU';
function hash(x) {
	var h = crypto.createHmac('sha512', MYHASHKEY);
    h.update(x)
    return h.digest('hex');
}
const USERSdata = [
	 {
		accountId:'23121d3c-84df-44ac-b458-3d63a9a05497', 
		login: 'paolo',
		passwordHash: hash('aaa'),
		claims : {
			email : 'foo@example.com',
			email_verified: true,
			altro: 'aaa',
			organigramma: [
				{ societa:'pippo', dipartimento:'pluto', ruolo:'direttore'},
				{ societa:'pluto', dipartimento:'paperino', ruolo:'consultatore'}
			],
			abilitazioni: [
				{ sistema:'protocollo', ambito:'affari legali', profilo:'inserimento dati'}
			]
		},
	},
	{
		accountId: 'c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5',
		login: 'pippo',
		passwordHash: hash('bbb'),
		claims : {
			email : 'bar@example.com',
			email_verified: false,
			altro: 'bbb',
			organigramma: [
				{ societa:'acme', dipartimento:'pluto', ruolo:'direttore'},
				{ societa:'acme', dipartimento:'paperino', ruolo:'consultatore'}
			],
			abilitazioni: [
				{ sistema:'protocollo', ambito:'affari legali', profilo:'inserimento dati' }
			]
		}
	}
];

var idMap = {}, loginMap={};

class Account {
	static inizializza() {
		for(var i=0; i<USERSdata.length; i++) {
			let x = USERSdata[i];
			let y = new Account(x.accountId);
			y.claimsData = x.claims;
			y.passwordHash = x.passwordHash;
			idMap[x.accountId] = y;
			loginMap[x.login] = y;
		}
	}

	constructor(x) {
		this.accountId = x || uuidv1(); // the property named accountId is important to oidc-provider
		this.claimsData = {};
	}

	// claims() should return or resolve with an object with claims that are mapped 1:1 to
	// what your OP supports, oidc-provider will cherry-pick the requested ones automatically
	claims() {
		return Object.assign({}, this.claimsData, {
			sub: this.accountId,
			altro_ancora: {
				p:123,
				q:new Date()
			}
		});
	}

	static async findById(ctx, id) {
		return idMap[id];
	}


	
	static async findByLogin(login) {
		return loginMap[login];
	}

	async authenticate(password) {
		var hp = hash(password);
		return hp==this.passwordHash;
	}
};

Account.inizializza();

module.exports = Account;
