export interface MessageContentDTO {
  type: string,
  text: {
    value: string,
    annotations: any[]
  }
}
