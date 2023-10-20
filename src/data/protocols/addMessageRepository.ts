import { type MessageModel } from '@/domain/models/message';
import { type AddMessageModel } from '@/domain/useCases/addMessage';

export interface AddMessageRepository {
  add: (messageData: AddMessageModel) => Promise<MessageModel>;
}
