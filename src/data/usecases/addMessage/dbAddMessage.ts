import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { type MessageModel } from '@/domain/models/message';
import { type AddMessageModel, type AddMessage } from '@/domain/useCases/addMessage';

export class DbAddMessage implements AddMessage {
  constructor (private readonly addMessageRepository: AddMessageRepository) {}

  async add (messageData: AddMessageModel): Promise<MessageModel> {
    await this.addMessageRepository.add(messageData);

    return null;
  }
}
