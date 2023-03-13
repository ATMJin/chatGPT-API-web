import { Option } from "./class/db.class";
import { getCollection } from "./connect_DB";

/** 從資料庫取得上一次的參數 */
export const getLastOption = async (): Promise<Option> => {
  console.log("getLastOption Start");
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