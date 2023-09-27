import { connectToDatabase, getCollection } from '~/composables/mongo_DB/connect_DB';
import { getLastOption, getLastContinuation, getAllType } from '~/composables/mongo_DB/find_DB';

export default defineEventHandler(async (event) => {
  try {
    console.log("API onInit Start");
    const hasDB = await connectToDatabase();
    console.log("API onInit connectToDatabase Success");
    const option = await getLastOption();
    console.log("option: ", option);
    const continuation = await getLastContinuation();
    console.log("continuation: ", continuation);
    const type_list = await getAllType();
    console.log("type_list: ", type_list);

    console.log("API onInit Success");
    return {
      option: option,
      continuation: continuation,
      type_list: type_list,
      isConnectDB: hasDB,
    };
  } catch {
    // throw new Error("API onInit Error");
    return {
      option: {},
      continuation: false,
      type_list: [],
      isConnectDB: false,
    };
  }
});
