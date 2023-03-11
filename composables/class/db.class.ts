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
  /** 結束原因 */
  finish_reason?: string;
  /** 使用token數 */
  usage?: {
    /** 發送 */
    prompt_tokens?: number;
    /** 生成 */
    completion_tokens?: number;
    /** 總共 */
    total_tokens?: number;
  };
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

  constructor(option: Option) {
    this.temperature = option.temperature;
    this.top_p = option.top_p;
    this.n = option.n;
    this.stream = option.stream;
    this.stop = option.stop;
    this.max_tokens = option.max_tokens;
    this.presence_penalty = option.presence_penalty;
    this.frequency_penalty = option.frequency_penalty;
    this.logit_bias = option.logit_bias;
    this.user = option.user;
  }
}