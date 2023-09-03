import { connectToDatabase } from '~~/composables/connect_DB';
import { insertChatMessage } from '~~/composables/insert_DB';
import { getLastMessage, getLastResult, getInitMessage } from '~~/composables/find_DB';
import {
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
import { Message, Model, Role } from '~~/composables/class/chat.class';
import { DB_Chat, Option } from '~~/composables/class/db.class';
import { formateDate } from '~~/composables/date_formate';
import { encode } from 'gpt-3-encoder';


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
    await connectToDatabase();

    const body = await readBody(event);
    const content_from_web: string = body.content;
    const initSystemMessage: Message[] = await getInitMessage(body.type);
    let model: Model = Model.GPT_TURBO;

    const messages: Message[] = [];
    if (body.continuation) {
      const lastMessage = await getLastMessage();
      const lastResult = await getLastResult();
      if (!!lastMessage.length) {
        messages.push(...lastMessage);

        // 訊息tokens長度判斷，如果大於3800則將model改為 GPT_TURBO_16k
        const encoded = encode(messages.map(message => message.content).toString());
        if (encoded.length > 3800) {
          model = Model.GPT_TURBO_16k;
        }
        // 如果大於10000則刪除初始訊息後的三則訊息
        if (encoded.length > 10000) {
          messages.splice(initSystemMessage.length, 3);
        }

        messages.push({ role: Role.ASSISTANT, content: lastResult[body.result_index] });
      } else {
        messages.push(...initSystemMessage);
      }
    } else {
      messages.push(...initSystemMessage);
    }
    messages.push({ role: Role.USER, content: content_from_web });

    console.log("messages: ", messages);

    const option = new Option(body.option);
    option.presence_penalty = 0.7;
    option.logit_bias = {
      11505: -100,  // "Open"
      4946: -100,   // " Open"
      20185: -100,  // "AI"
      9552: -100,   // " AI"
      1872: -100,   // "ai"
    };

    const Request: CreateChatCompletionRequest = {
      model,
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

    // const result = completion.data.choices[0].message.content;
    const result: string[] = completion.data.choices.map((choice) => {
      return choice.message!.content;
    });
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