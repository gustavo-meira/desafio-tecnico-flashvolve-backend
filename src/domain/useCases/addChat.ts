import { type ChatModel } from '../models/chat';

export interface AddChatModel extends Omit<ChatModel, 'createdAt' | 'updatedAt'> {}

export interface AddChat {
  add: (chat: AddChatModel) => Promise<ChatModel>;
}
