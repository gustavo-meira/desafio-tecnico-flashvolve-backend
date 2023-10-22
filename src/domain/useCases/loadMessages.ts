import { type ChatModel } from '../models/chat';
import { type MessageModel } from '../models/message';

type ChatId = ChatModel['id'];

export interface LoadMessages {
  load: (chatId: ChatId) => Promise<MessageModel[]>;
}
