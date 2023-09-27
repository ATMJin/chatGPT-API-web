import { Option } from "./db.class";

export interface ChatRequest {
  content: string;
  option: Option;
  continuation: boolean;
  gpt4: boolean;
  type: string;
  result_index: number;
}