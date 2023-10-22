import { type LoadAllMessagesRepository } from '@/data/protocols/loadAllMessagesRepository';
import { type MessageModel } from '@/domain/models/message';
import { type LoadMessages } from '@/domain/useCases/loadMessages';

export class DbLoadAllMessages implements LoadMessages {
  constructor (private readonly loadAllMessagesRepository: LoadAllMessagesRepository) { }

  async load (chatId: number): Promise<MessageModel[]> {
    await this.loadAllMessagesRepository.loadAll(chatId);

    return [];
  }
}
