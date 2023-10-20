import { type MessageModel } from '../models/message';

export interface AddMessageModel extends Omit<MessageModel, 'id' | 'createdAt' | 'updatedAt'> {}

export interface AddMessage {
  add: (message: AddMessageModel) => Promise<MessageModel>;
}
