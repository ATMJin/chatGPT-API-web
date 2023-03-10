import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
const URI = useRuntimeConfig().private.mongo_uri;
let db: Db;
let collection_chat: Collection;

export const connectToDatabase = async () => {
  client = await MongoClient.connect(URI);
  db = client.db();
  collection_chat = db.collection("chat");
  console.log(db);
  console.log(collection_chat);
};

export const getDb = () => {
  return db;
};

export const getCollection = () => {
  return collection_chat;
};