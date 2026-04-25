import {MessageDTO} from "./MessageDTO";

export interface FullThreadDTO {
  object: string,
  data: MessageDTO[],
  first_id: string,
  last_id: string,
  has_more: boolean
}
