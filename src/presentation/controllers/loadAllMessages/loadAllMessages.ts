import { badRequest, notFound, serverError } from '@/presentation/helpers/httpHelpers';
import { type Validation, type Controller, type HttpRequest, type HttpResponse } from '../signup/signupProtocols';
import { type LoadMessages } from '@/domain/useCases/loadMessages';
import { NotFoundError } from '@/presentation/errors/notFoundError';

export class LoadAllMessagesController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadMessages: LoadMessages,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const messages = await this.loadMessages.load(httpRequest.body.chatId);

      if (messages.length === 0) {
        return notFound(new NotFoundError());
      }

      return null;
    } catch (error) {
      return serverError();
    }
  }
}
