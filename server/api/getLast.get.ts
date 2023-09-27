import { connectToDatabase, getCollection } from '~/composables/mongo_DB/connect_DB';
import { getLastResult } from '~/composables/mongo_DB/find_DB';

export default defineEventHandler(async (event) => {
  try {
    console.log("API getLastResult Start");
    const connectResult = await connectToDatabase();
    if (!connectResult) throw new Error("API onInit connectToDatabase Error");
    console.log("API onInit connectToDatabase Success");

    const lastResult = await getLastResult();
    console.log("lastResult: ", lastResult);

    return {
      result: lastResult,
    };
  } catch {
    // throw new Error("API onInit Error");
    return {
      lastResult: [],
    };
  }
});
