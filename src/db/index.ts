import { MongoClient } from 'mongodb';
import assert from 'assert';

const {
  MONGO_HOST, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE,
} = process.env;

const user = MONGO_USERNAME;
const password = MONGO_PASSWORD ? `:${MONGO_PASSWORD}` : '';
const userAuth = user ? [user, password].filter(Boolean).join('') : '';
const host = MONGO_HOST;
const port = MONGO_PORT ? `:${MONGO_PORT}` : '';
const address = host ? [host, port].filter(Boolean).join('') : '';

const uri = `mongodb://${[userAuth, address].filter(Boolean).join('@')}`;
console.info(`Mongo URI: ${uri}`);
const client = new MongoClient(uri, { useUnifiedTopology: true });

export const createConnection = async () => new Promise((res) => {
  client.connect((err) => {
    assert.equal(null, err);
    console.info('Connected successfully to mongodb');

    res(true);
  });
});

export const closeConnection = (force: boolean) => {
  client.close(force);
};

export const isConnected = () => client.isConnected();

const getDbConnection = async (database = MONGO_DATABASE) => client.db(database);
export default getDbConnection;
