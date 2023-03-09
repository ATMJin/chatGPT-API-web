import {
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";


export default defineEventHandler(async (event) => {
  const configuration = new Configuration({
    apiKey: useRuntimeConfig().private.apiKey
  });
  const openai = new OpenAIApi(configuration);

  if (!configuration.apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured, please follow instructions in README.md',
    });
  }

  try {
    const body = await readBody(event);
    const Request: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: body.animal }],
      temperature: 1,
    };
    const completion = await openai.createChatCompletion(Request);
    console.log(completion);
    console.log(completion.data);

    if (!completion.data.choices[0].message) {
      throw createError({
        statusCode: 501,
        statusMessage: 'completion.data.choices[0].message == undefined',
      });
    }
    return {
      result: completion.data.choices[0].message.content
    };

  } catch (error: any) {
    return {
      result: error.stack
    };
  }

});