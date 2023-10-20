import { type AddChatRepository } from '@/data/protocols/addChatRepository';
import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { type MessageModel } from '@/domain/models/message';
import { type AddMessageModel, type AddMessage } from '@/domain/useCases/addMessage';

export class DbAddMessage implements AddMessage {
  constructor (
    private readonly addMessageRepository: AddMessageRepository,
    private readonly addChatRepository: AddChatRepository,
  ) {}

  async add (messageData: AddMessageModel): Promise<MessageModel> {
    await this.addChatRepository.add({
      id: messageData.chatId,
      lastMessage: messageData.text,
      name: messageData.senderName,
    });

    const message = await this.addMessageRepository.add(messageData);

    return message;
  }
}
