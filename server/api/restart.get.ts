import { connectToDatabase } from "~~/composables/connect_DB";
import { updateContinuation } from "~~/composables/update_DB";

// 重新開始對話
export default defineEventHandler(async (event) => {
  await connectToDatabase();
  await updateContinuation();
  return {
    message: "Restart Success",
  };
});