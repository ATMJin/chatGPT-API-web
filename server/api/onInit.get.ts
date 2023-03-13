import { connectToDatabase } from '~~/composables/connect_DB';
import { getLastOption } from '~~/composables/find_DB';

export default defineEventHandler(async (event) => {
  try {
    console.log("API onInit Start");
    await connectToDatabase();
    console.log("API onInit connectToDatabase Success");
    const option = await getLastOption();
    console.log("option: ", option);

    return {
      option: option,
    };
  } catch { 
    return {
      ok: true,
      result: 'Hello World!',
      event: event.path
    };
  }


});
