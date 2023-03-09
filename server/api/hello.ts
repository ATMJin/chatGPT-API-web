

export default defineEventHandler((event) => {
  console.log("aaaaaaaaaaaaaaaa")
  return {
    ok: true,
    data: 'Hello World!',
    event: event.path
  };
});