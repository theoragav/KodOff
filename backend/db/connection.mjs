import { MongoClient } from "mongodb";

const DB_CONNECTION_STRING = "mongodb+srv://shannonanggab:nVWdKauh79sszvYb@kodoff.iyivfvn.mongodb.net/"
const client = new MongoClient(DB_CONNECTION_STRING);

let connection;
try {
    connection = await client.connect();
} catch(error) {
  console.error(error);
}

let db = connection.db("KodOff");
export default db;