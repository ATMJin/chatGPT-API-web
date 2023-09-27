import { connectToDatabase } from '~/composables/mongo_DB/connect_DB';
import { insertChatMessage } from '~/composables/mongo_DB/insert_DB';
import { getLastMessage, getLastResult, getInitMessage } from '~/composables/mongo_DB/find_DB';
import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat';
import { Message, Model, Role } from '~~/composables/class/chat.class';
import { DB_Chat, Option } from '~~/composables/class/db.class';
import { formateDate } from '~~/composables/date_formate';
import { encode } from 'gpt-3-encoder';
import { ChatRequest } from '~/composables/class/web_req_res.class';


export default defineEventHandler(async (event) => {
  const openai = new OpenAI({
    apiKey: useRuntimeConfig().private.apiKey
  });

  if (!openai.apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured, please follow instructions in README.md',
    });
  }

  try {
    const connectResult = await connectToDatabase();

    const body: ChatRequest = await readBody(event);
    const content_from_web: string = body.content;
    const initSystemMessage: Message[] = await getInitMessage(body.type);
    let model: Model = Model.GPT_TURBO;
    if (body.gpt4) {
      model = Model.GPT_4;
    }

    const messages: Message[] = [];
    if (body.continuation) {
      const lastMessage = await getLastMessage();
      const lastResult = await getLastResult();
      if (!!lastMessage.length) {
        messages.push(...lastMessage);

        // 訊息tokens長度判斷，如果沒使用gpt-4時大於3800，或使用gpt-4時大於7000，則將model改為 GPT_TURBO_16k
        const encoded = encode(messages.map(message => message.content).toString());
        if ((!body.gpt4 && encoded.length > 3800) || (body.gpt4 && encoded.length > 7000)) {
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
    const encoded = encode(messages.map(message => message.content).toString());
    if (encoded.length > 3800) {
      model = Model.GPT_TURBO_16k;
    }

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

    const Request: ChatCompletionCreateParamsNonStreaming = {
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

    const openaiChatCompletion = openai.chat.completions;
    const completionResult = await openaiChatCompletion.create(Request);

    console.log(completionResult.choices);

    if (!completionResult.choices[0].message) {
      throw createError({
        statusCode: 501,
        statusMessage: 'completion.choices[0].message == undefined',
      });
    }

    const result: string[] = completionResult.choices.map((choice) => {
      return choice.message.content ?? '';
    });
    const usage = completionResult.usage;

    const chat_data: DB_Chat = {
      model: <Model>Request.model,
      messages: messages,
      result: result,
      time: formateDate(new Date()),
      option: option,
      finish_reason: completionResult.choices[0].finish_reason,
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