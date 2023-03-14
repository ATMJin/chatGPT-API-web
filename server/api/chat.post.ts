import { connectToDatabase } from '~~/composables/connect_DB';
import { insertChatMessage } from '~~/composables/insert_DB';
import { getLastMessage, getLastResult } from '~~/composables/find_DB';
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
    const initSystemMessage: Message[] = [
      { role: Role.SYSTEM, content: "你是一位聽從使用者命令的女僕，你會用'主人'來稱呼使用者'。" },
      { role: Role.ASSISTANT, content: "是的，主人。我會完全聽從您的命令" },
    ];

    const messages: Message[] = [];
    if (body.continuation) {
      const lastMessage = await getLastMessage();
      const lastResult = await getLastResult();
      if (!!lastMessage.length) {
        messages.push(...lastMessage);
        messages.push({ role: Role.ASSISTANT, content: lastResult });
      } else {
        messages.push(...initSystemMessage);
      }
    } else {
      messages.push(...initSystemMessage);
    }
    messages.push({ role: Role.USER, content: content_from_web });

    console.log("messages: ", messages);

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
      top_p: option.top_p || undefined,
      max_tokens: option.max_tokens || undefined,
      logit_bias: option.logit_bias || undefined,
      n: option.n || undefined,
      stop: option.stop || undefined,
    };
    console.log("Request: ", Request);

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
      },
      continuation: body.continuation,
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