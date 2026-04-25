import {MessageContentDTO} from "./MessageContentDTO";

export interface MessageDTO {
  id: string,
  object: string,
  created_at: number,
  assistant_id: string,
  thread_id: string,
  run_id: string,
  role: string,
  content: MessageContentDTO[],
  attachments: any[],
  metadata: any
}
