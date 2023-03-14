import { connectToDatabase, getCollection } from '~~/composables/connect_DB';
import { getLastOption, getLastContinuation } from '~~/composables/find_DB';

export default defineEventHandler(async (event) => {
  try {
    console.log("API onInit Start");
    await connectToDatabase();
    console.log("API onInit connectToDatabase Success");
    const option = await getLastOption();
    console.log("option: ", option);
    const continuation = await getLastContinuation();

    return {
      option: option,
      continuation: continuation,
    };
  } catch {
    // throw new Error("API onInit Error");
    return {
      option: {},
    };
  }
});
