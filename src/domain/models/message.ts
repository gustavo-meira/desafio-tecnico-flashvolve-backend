export interface MessageModel {
  id: number;
  text: string;
  senderName: string;
  fromBot: boolean;
  chatId: number;
  createdAt: Date;
  updatedAt: Date;
}
