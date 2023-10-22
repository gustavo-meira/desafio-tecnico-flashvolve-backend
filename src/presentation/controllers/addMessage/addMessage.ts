import { badRequest, ok, serverError } from '@/presentation/helpers/httpHelpers';
import { type HttpRequest, type Controller, type HttpResponse, type Validation } from '../signup/signupProtocols';
import { type AddMessage } from '@/domain/useCases/addMessage';

export class AddMessageController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addMessage: AddMessage,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const message = await this.addMessage.add({
        ...httpRequest.body,
        fromBot: true,
      });

      return ok(message);
    } catch (error) {
      return serverError();
    }
  }
}
