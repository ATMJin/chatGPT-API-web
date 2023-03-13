import { connectToDatabase } from '~~/composables/connect_DB';
import { insertChatMessage } from '~~/composables/insert_DB';
import {
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
import { Message, Model, Role } from '~~/composables/class/chat.class';
import { DB_Chat, Option } from '~~/composables/class/db.class';
import { formateDate } from '~~/composables/date_formate';


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
    const content_from_web = body.content;

    const messages: Message[] = [];
    messages.push({ role: Role.SYSTEM, content: "你是一位聽從使用者命令的女僕，你會用'主人'來稱呼使用者'。" });
    messages.push({ role: Role.USER, content: content_from_web });
    const option = new Option(body.option);
    option.logit_bias = {
      11505: -100,  // "Open"
      4946: -100,   // " Open"
      20185: -100,  // "AI"
      9552: -100,   // " AI"
      1872: -100,   // "ai"
    };

    const Request: CreateChatCompletionRequest = {
      model: Model.GPT_TURBO,
      messages: messages,
      temperature: option.temperature || undefined,
      max_tokens: option.max_tokens || undefined,
      logit_bias: option.logit_bias || undefined,
    };

    const completion = await openai.createChatCompletion(Request);

    console.log(completion.data.choices);

    if (!completion.data.choices[0].message) {
      throw createError({
        statusCode: 501,
        statusMessage: 'completion.data.choices[0].message == undefined',
      });
    }

    const result = completion.data.choices[0].message.content;
    const usage = completion.data.usage;

    const chat_data: DB_Chat = {
      model: Model.GPT_TURBO,
      messages: messages,
      result: result,
      time: formateDate(new Date()),
      option: option,
      finish_reason: completion.data.choices[0].finish_reason,
      usage: {
        prompt_tokens: usage?.prompt_tokens,
        completion_tokens: usage?.completion_tokens,
        total_tokens: usage?.total_tokens,
      }
    };

    await connectToDatabase();
    await insertChatMessage(chat_data);

    return {
      result: result
    };

  } catch (error: any) {
    return {
      result: error.stack
    };
  }

});