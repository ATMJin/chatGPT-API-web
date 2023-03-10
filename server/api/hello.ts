import { connectToDatabase, getDb } from './../../composables/connect_DB';

export default defineEventHandler(async (event) => {
  await connectToDatabase();
  console.log("ssssssssssssssss");
  console.log(getDb());
  return {
    ok: true,
    data: 'Hello World!',
    event: event.path
  };
});