import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { ok, serverError } from '@/presentation/helpers/httpHelpers';
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols';

export class MessageReceiverController implements Controller {
  constructor (private readonly addMessageRepository: AddMessageRepository) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const message = await this.addMessageRepository.add(httpRequest.body);

      return ok(message);
    } catch (error) {
      return serverError();
    }
  }
}
