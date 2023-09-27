import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
const URI = useRuntimeConfig().private.mongo_uri;
let db: Db;
let collection_chat: Collection;
let collection_system: Collection;
let hasDB: boolean = false;

/** DB連線 */
export const connectToDatabase: () => Promise<boolean> = async () => {
  if (!URI) {
    console.log("現在是無DB環境");
    hasDB = false;
    return hasDB;
  } else {
    if (!hasDB) {
      console.log("無DB");
      return hasDB;
    }
    try {
      console.log("ConnectToDatabase Start");
      client = await MongoClient.connect(URI);
      db = client.db();
      collection_chat = db.collection("chat");
      collection_system = db.collection("system_setting");
      console.log("ConnectToDatabase Success");
      hasDB = true;
    } catch {
      console.log("ConnectToDatabase Error");
      hasDB = false;
    }
    return hasDB;
  }
};

/** 取得DB */
export const getDb: () => Db = () => {
  console.log("getDb");
  return db;
};

/** 取得 Chat Collection */
export const getCollection: () => Collection = () => {
  console.log("getCollection");
  return collection_chat;
};

/** 取得 System Collection */
export const getCollectionSystem: () => Collection = () => {
  console.log("getCollectionSystem");
  return collection_system;
};

/** 取得是否為有DB環境 */
export const getHasDB: () => boolean = () => {
  console.log("getHasDB");
  return hasDB;
};