import { type MessageModel } from '@/domain/models/message';

export interface PostMessage {
  postMessage: (message: MessageModel) => Promise<void>;
}
