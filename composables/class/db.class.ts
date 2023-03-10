import { Message, Model } from "./chat.class";

export class DB_Chat {
  /** 使用模型 */
  model: Model = Model.GPT_TURBO;
  /** 輸入訊息 */
  messages: Message[] = [];
  /** 參數 */
  option?: Option;
  /** 回復訊息 */
  result: string = "";
  /** 時間 yyyy-MM-dd HH:mm:ss*/
  time: string = "";
}

export class Option {
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: {};
  user?: string;
}