import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols';

export class MessageReceiverController implements Controller {
  constructor (private readonly addMessageRepository: AddMessageRepository) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.addMessageRepository.add(httpRequest.body);

    return null;
  }
}
