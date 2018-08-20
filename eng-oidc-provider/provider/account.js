const assert = require('assert');
const _ = require('lodash');
const uuidv1 = require('uuid/v1');

const USERSdata = [
	 {
		accountId:'23121d3c-84df-44ac-b458-3d63a9a05497', 
		login: 'paolo',
		claims : {
			email: 'foo@example.com',
			email_verified: true,
			altro: 'aaa'
		}
	},
	{
		accountId: 'c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5',
		login: 'pippo',
		claims : {
			email: 'bar@example.com',
			email_verified: false,
			altro: 'bbb'
		}
	}
];

var imap = {}, lmap={};

class Account {
	static inizializza() {
		for(var i=0; i<USERSdata.length; i++) {
			let x = USERSdata[i];
			let y = new Account(x.accountId);
			y.claimsData = x.claims;
			imap[x.accountId] = y;
			lmap[x.login] = y;
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
		// var a = USERS.filter(x=>x.accountId==id);
		// return (a.length>=1) ? a[0] : new Account(id);
		return imap[id];
	}


	
	static async findByLogin(login) {
		// var a = USERS.filter(x=>x.login==login);
		// return (a.length>=1) ? a[0] :  null;
		return lmap[login];
	}

	static async authenticate(email, password) {
		throw (' PER ORA NON IMPLEMENTATO ');
		// assert(password, 'password must be provided');
		// assert(email, 'email must be provided');
		// const lowercased = String(email).toLowerCase();
		// const id = _.findKey(USERS, { email: lowercased });
		// assert(id, 'invalid credentials provided');

		// // this is usually a db lookup, so let's just wrap the thing in a promise
		// return new this(id);
	}
};

Account.inizializza();

module.exports = Account;
