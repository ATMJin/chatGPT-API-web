import { connectToDatabase, getDb } from './../../composables/connect_DB';

export default defineEventHandler(async (event) => {
  await connectToDatabase();
  console.log("===================");
  return {
    ok: true,
    result: 'Hello World!',
    event: event.path
  };
});