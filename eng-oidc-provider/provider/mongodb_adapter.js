const { MongoClient } = require('mongodb'); // eslint-disable-line import/no-unresolved
const { snakeCase } = require('lodash');
//const mongoURI = 'mongodb://127.0.0.1:27017/?';
//const mongoURI = '127.0.0.1:27017/?';
const mongoURI = 'mongodb://localhost:27017/eng-ms';
let DB;

const VERBOSE = false;
function mylog() {
	if (VERBOSE)
		console.log.apply(console, arguments);
}

const grantable = new Set([
	'access_token',
	'authorization_code',
	'refresh_token',
	'device_code',
]);

class CollectionSet extends Set {
	add(name) {
		const nu = this.has(name);
		super.add(name);
		if (!nu) {
			DB.collection(name).createIndexes([
				...(grantable.has(name)
					? [{
						key: { grantId: 1 },
						partialFilterExpression: { grantId: { $exists: true } },
						background: true,
					}] : []),
				...(name === 'device_code'
					? [{
						key: { userCode: 1 },
						partialFilterExpression: { userCode: { $exists: true } },
						background: true,
						unique: true,
					}] : []),
				{
					key: { expiresAt: 1 },
					expireAfterSeconds: 0,
					background: true,
				},
			]).catch(console.error); // eslint-disable-line no-console
		}
	}
}

const collections = new CollectionSet();

class MongoAdapter {
	constructor(name) {
		mylog('MONGO constructor: '+name);
		this.name = snakeCase(name);
		collections.add(this.name);
	}

	// note: the payload for Session model may contain client_id as keys, make sure you do not use
	//   dots (".") in your client_id value charset.
	async upsert(_id, payload, expiresIn) {
		mylog('MONGO upsert: '+this.name);
		
		let expiresAt;

		if (expiresIn) {
			expiresAt = new Date(Date.now() + (expiresIn * 1000));
		}

		await this.coll().updateOne({ _id }, {
			$set: {
				_id,
				...payload,
				...(expiresAt ? { expiresAt } : undefined),
			},
		}, { upsert: true });
	}

	async find(_id) {
		mylog('MONGO find: '+this.name+', '+_id);

		return this.coll().find({ _id }).limit(1).next();
	}

	async findByUserCode(userCode) {
		mylog('MONGO findByUserCode: '+this.name+', '+userCode);
		return this.coll().find({ userCode }).limit(1).next();
	}

	async destroy(_id) {
		mylog('MONGO destroy: '+this.name+', '+_id);
		const found = await this.coll().findOneAndDelete({ _id });
		if (found.value && found.value.grantId) {
			const promises = [];

			collections.forEach((name) => {
				if (grantable.has(name)) {
					promises.push(this.coll(name).deleteMany({ grantId: found.value.grantId }));
				}
			});

			await Promise.all(promises);
		}
	}

	async consume(_id) {
		mylog('MONGO consume: '+this.name+', '+_id);
		await this.coll().findOneAndUpdate({ _id }, { $currentDate: { consumed: true } });
	}

	coll(name) {
		//mylog('MONGO coll: '+this.name+', '+name);
		return this.constructor.coll(name || this.name);
	}

	static coll(name) {
		mylog('static MONGO coll: '+name);
		return DB.collection(name);
	}

	static async connect() {
		mylog('static MONGO connect');
		const connection = await MongoClient.connect(mongoURI, {
			useNewUrlParser: true,
		});
		DB = connection.db(connection.s.options.dbName);
	}
};

module.exports = MongoAdapter;
