export interface MessageDTO {
  id: string,
  object: string,
  created_at: number,
  assistant_id: string,
  thread_id: string,
  run_id: string,
  role: string,
  content: any[],
  attachments: any[],
  metadata: any
}
