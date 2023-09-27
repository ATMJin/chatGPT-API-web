export class ChatReq {
  /**
  * 使用的模型ID。目前僅支持gpt-3.5-turbo和gpt-3.5-turbo-0301。
  */
  model: Model = Model.GPT_TURBO;
  /**
  * 聊天格式的輸入消息。
  */
  messages: Message[] = [];
  /**
  * 用於抽樣的溫度值，範圍在0和2之間。較高的值（如0.8）會使輸出更加隨機，而較低的值（如0.2）會使其更加集中和確定性。
  * 通常建議更改此值或top_p值中的一個，而不是兩個都更改。
  * 默認值為1。
  */
  temperature?: number;
  /**
  * 用於取樣的替代方案，稱為nucleus抽樣，其中模型考慮概率質量為top_p的令牌的結果。
  * 因此，0.1表示僅考慮佔概率質量前10％的令牌。
  * 通常建議更改此值或溫度值中的一個，而不是兩個都更改。
  * 默認值為1。
  */
  top_p?: number;
  /**
  * 為每個輸入消息生成多少個聊天完成選擇。
  * 默認值為1。
  */
  n?: number;
  /**
  * 如果設置為 true，將發送部分消息增量，就像在 ChatGPT 中一樣。
  * 令牌將作為僅數據的服務器發送事件隨著其可用性而逐漸發送，
  * 並在數據：[DONE] 消息終止時終止流。
  */
  stream?: boolean;
  /**
  * 要求 API 在生成一定數量的標記後停止。
  * 可以設置為一個序列或多個序列數組，最多可設置4個序列。
  */
  stop?: string | string[];
  /**
  * 允許生成的答案最大標記數。默認為無限制。
  * 默認情況下，模型可以返回的標記數為（4096-提示標記）。
  */
  max_tokens?: number;
  /**
  * 在給定文本中減少已存在的詞的可能性。此處為存在懲罰。
  * 數字範圍為-2.0至2.0。
  * 正數值基於它們在文本中出現的頻率對新詞進行懲罰，降低了模型重複相同行的可能性。
  * 有關頻率和存在懲罰的更多信息，請參見相關文檔。
  */
  presence_penalty?: number;
  /**
  * 在生成新詞時增加已存在詞的可能性。此處為頻率懲罰。
  * 數字範圍為-2.0至2.0。
  * 正數值基於新詞在文本中出現的頻率對其進行懲罰，減少了模型提及相同詞的可能性。
  * 有關頻率和存在懲罰的更多信息，請參見相關文檔。
  */
  frequency_penalty?: number;
  /**
  * 修改完成中指定標記出現的可能性。
  * 接受一個JSON對象，將標記（由其在分詞器中的標記ID指定）映射到-100至100的關聯偏差值。
  * 在數學上，模型生成的對數之前添加偏差值後進行抽樣。具體效果會因模型而異，
  * 但介於-1和1之間的值應該會減少或增加選擇的可能性；像-100或100這樣的值應該會導致相關標記的禁止或獨占選擇。
  */
  logit_bias?: {};
  /**
  * 代表您的最終用戶的唯一標識符，可以幫助OpenAI監控和檢測濫用。
  */
  user?: string;
}

export class Message {
  role: Role;
  content: string;

  constructor(role: Role, content: string) {
    this.role = role;
    this.content = content;
  }
}

export enum Model {
  GPT_TURBO = "gpt-3.5-turbo",
  GPT_TURBO_0301 = "gpt-3.5-turbo-0301",
  GPT_TURBO_0613 = "gpt-3.5-turbo-0613",
  GPT_TURBO_16k = "gpt-3.5-turbo-16k",
  GPT_TURBO_16k_0613 = "gpt-3.5-turbo-16k-0613",
  GPT_4_0613 = "gpt-4-0613",
  GPT_4 = "gpt-4",
}


export enum Role {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant"
}