export type MessageAuthorType =
  | "customer"
  | "agent";


export interface TicketMessage {
  id: string;
  author: {
    name: string;
    type: MessageAuthorType;
  };
  message: string;
  createdAt: string;
}


export interface TicketConversationData {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  messages: TicketMessage[];

}