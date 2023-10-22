import { type ChatModel } from '../models/chat';

export interface LoadAllChats {
  loadAll: () => Promise<ChatModel[]>;
}
