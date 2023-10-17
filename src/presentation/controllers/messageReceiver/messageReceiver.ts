import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { serverError } from '@/presentation/helpers/httpHelpers';
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols';

export class MessageReceiverController implements Controller {
  constructor (private readonly addMessageRepository: AddMessageRepository) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.addMessageRepository.add(httpRequest.body);

      return null;
    } catch (error) {
      return serverError();
    }
  }
}
