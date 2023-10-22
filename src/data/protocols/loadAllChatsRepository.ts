import { type ChatModel } from '@/domain/models/chat';

export interface LoadAllChatsRepository {
  loadAll: () => Promise<ChatModel[]>;
};
