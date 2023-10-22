import { badRequest } from '@/presentation/helpers/httpHelpers';
import { type HttpRequest, type Controller, type HttpResponse, type Validation } from '../signup/signupProtocols';

export class AddMessageController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);

    if (error) {
      return badRequest(error);
    }

    return null;
  }
}
