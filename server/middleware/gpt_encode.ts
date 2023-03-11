import { encode } from 'gpt-3-encoder';

export default defineEventHandler((event) => {
  let params = "";
  readBody(event).then((body) => {
    params = body.content;
    const encoded = encode(params);
    console.log("encoded: ", encoded);
  });
});