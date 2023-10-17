import { prismaDB } from '../lib/db';
import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { type MessageModel } from '@/domain/models/message';
import { type AddMessageModel } from '@/domain/useCases/addMessage';

export class MessagePrismaRepo implements AddMessageRepository {
  async add (messageData: AddMessageModel): Promise<MessageModel> {
    await prismaDB.message.create({
      data: {
        senderName: messageData.senderName,
        text: messageData.text,
        fromBot: messageData.fromBot,
        Chat: {
          connectOrCreate: {
            where: {
              id: messageData.chatId,
            },
            create: {
              lastMessage: messageData.text,
              name: messageData.senderName,
            },
          },
        },
      },
    });

    return null;
  }
}
