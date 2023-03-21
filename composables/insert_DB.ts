import { DB_Chat } from './class/db.class';
import { getCollection, getHasDB } from "./connect_DB";

export const insertChatMessage = async (chat_data: DB_Chat) => {
  if (getHasDB()) {
    console.log("inserting");
    // console.log("data:", chat_data);
    const collection = getCollection();
    await collection.insertOne(chat_data);
    console.log("inserted");
    console.log("data_base:", await collection.findOne(chat_data));
  } else {
    console.log("無DB環境");
  }
};