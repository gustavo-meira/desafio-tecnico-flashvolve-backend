import { type AddMessageModel } from '@/domain/useCases/addMessage';

export interface PostMessage {
  postMessage: (message: AddMessageModel) => Promise<void>;
}
