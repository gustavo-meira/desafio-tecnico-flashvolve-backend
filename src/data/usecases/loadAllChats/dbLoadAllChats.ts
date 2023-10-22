import { type LoadAllChatsRepository } from '@/data/protocols/loadAllChatsRepository';
import { type ChatModel } from '@/domain/models/chat';
import { type LoadAllChats } from '@/domain/useCases/loadAllChats';

export class DbLoadAllChats implements LoadAllChats {
  constructor (private readonly loadAllChatsRepository: LoadAllChatsRepository) { }

  async loadAll (): Promise<ChatModel[]> {
    await this.loadAllChatsRepository.loadAll();

    return [];
  }
}
