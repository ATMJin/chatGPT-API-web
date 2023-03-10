import { DB_Chat } from './class/db.class';
import { getCollection } from "./connect_DB";

export const insertChatMessage = async (chat_data: DB_Chat) => {
  console.log("inserting");
  console.log("data:", chat_data);
  const collection = getCollection();
  collection.insertOne(chat_data);
  console.log("inserted");
  console.log("data_base:", await collection.findOne(chat_data));

};