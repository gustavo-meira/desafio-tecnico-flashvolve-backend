import { type ChatModel } from '@/domain/models/chat';
import { type AddChatModel } from '@/domain/useCases/addChat';

export interface AddChatRepository {
  add: (chatData: AddChatModel) => Promise<ChatModel>;
}
