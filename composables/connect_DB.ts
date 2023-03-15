import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
const URI = useRuntimeConfig().private.mongo_uri;
let db: Db;
let collection_chat: Collection;
let collection_system: Collection;

export const connectToDatabase = async () => {
  try {
    console.log("ConnectToDatabase Start");
    client = await MongoClient.connect(URI);
    db = client.db();
    collection_chat = db.collection("chat");
    collection_system = db.collection("system_setting");
    console.log("ConnectToDatabase Success");
  } catch {
    console.log("ConnectToDatabase Error");
  }
};

export const getDb = () => {
  console.log("getDb");
  return db;
};

export const getCollection = () => {
  console.log("getCollection");
  return collection_chat;
};

export const getCollectionSystem = () => {
  console.log("getCollectionSystem");
  return collection_system;
};