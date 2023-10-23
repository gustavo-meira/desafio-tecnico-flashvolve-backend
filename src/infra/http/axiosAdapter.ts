import { type PostMessage } from '@/data/protocols/postMessage';
import { type MessageModel } from '@/domain/models/message';
import axios from 'axios';

export class AxiosAdapter implements PostMessage {
  constructor (
    private readonly url: string,
    private readonly botToken: string,
  ) {}

  async postMessage (message: MessageModel): Promise<void> {
    await axios.post(`${this.url}/bot${this.botToken}/sendMessage`, {
      chat_id: message.chatId,
      text: message.text,
    });
  }
}
