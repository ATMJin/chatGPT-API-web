import { connectToDatabase } from "~/composables/mongo_DB/connect_DB";
import { updateContinuation } from "~/composables/mongo_DB/update_DB";

// 重新開始對話
export default defineEventHandler(async (event) => {
  await connectToDatabase();
  await updateContinuation();
  return {
    message: "Restart Success",
  };
});