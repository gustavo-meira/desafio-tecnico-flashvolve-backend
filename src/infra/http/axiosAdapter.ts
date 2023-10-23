import { type PostMessage } from '@/data/protocols/postMessage';
import { type AddMessageModel } from '@/domain/useCases/addMessage';
import axios from 'axios';

export class AxiosAdapter implements PostMessage {
  constructor (
    private readonly url: string,
    private readonly botToken: string,
  ) {}

  async postMessage (message: AddMessageModel): Promise<void> {
    await axios.post(`${this.url}/bot${this.botToken}/sendMessage`, {
      chat_id: message.chatId,
      text: message.text,
    });
  }
}
