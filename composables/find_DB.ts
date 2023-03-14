import { Message } from "./class/chat.class";
import { Option } from "./class/db.class";
import { getCollection } from "./connect_DB";

/** 從資料庫取得上一次的參數 */
export const getLastOption = async (): Promise<Option> => {
  console.log("getLastOption Start");
  // await connectToDatabase();
  const collection = getCollection();

  console.log("get Last Start");
  const last = await collection.find().sort({ _id: -1 }).limit(1).toArray();
  console.log("last: ", last);

  if (!last.length) {
    console.log("getLastOption Error");
    return new Option({});
  } else {
    return new Option(last[0].option);
  }
};

/** 從資料庫取得上一次的對話紀錄 */
export const getLastMessage = async (): Promise<Message[]> => {
  console.log("getLastMessage Start");
  const collection = getCollection();

  const last = await collection.find().sort({ _id: -1 }).limit(1).toArray();
  console.log("last: ", last);

  if (!last.length || !last[0].continuation) {
    console.log("getLastMessage Error");
    return [];
  } else {
    return last[0].messages;
  }
};

/** 從資料庫取得上一次的結果 */
export const getLastResult = async (): Promise<string> => {
  console.log("getLastResult Start");
  const collection = getCollection();

  const last = await collection.find().sort({ _id: -1 }).limit(1).toArray();
  console.log("last: ", last);

  if (!last.length || !last[0].continuation) {
    console.log("getLastResult Error");
    return "";
  } else {
    return last[0].result;
  }
};

/** 從資料庫取得上一次是否是連續對話 */
export const getLastContinuation = async (): Promise<boolean> => {
  console.log("getLastContinuation Start");
  const collection = getCollection();

  const last = await collection.find().sort({ _id: -1 }).limit(1).toArray();
  console.log("last: ", last);

  if (!last.length) {
    console.log("getLastContinuation Error");
    return false;
  } else {
    return last[0].continuation;
  }
};
