import { connectToDatabase, getCollection } from '~~/composables/connect_DB';
import { getLastResult } from '~~/composables/find_DB';

export default defineEventHandler(async (event) => {
  try {
    console.log("API getLastResult Start");
    await connectToDatabase();
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
