export interface CreateMessageDto {
  title: string;
  body: string;
}

export interface SendReplyDto {
  messageId: string;
  content: string;
}

export interface ArchiveMessageDto {
  messageId: string;
}

export interface DeleteMessageDto {
  messageId: string;
}