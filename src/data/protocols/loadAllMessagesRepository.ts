import { type MessageModel } from '@/domain/models/message';

export interface LoadAllMessagesRepository {
  loadAll: (chatId: number) => Promise<MessageModel[]>;
}
