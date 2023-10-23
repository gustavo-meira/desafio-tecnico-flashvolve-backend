import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type AddAccount,
  type Validation,
} from './signupProtocols';
import { badRequest, created, serverError } from '@/presentation/helpers/httpHelpers';

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {};

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { name, email, password } = httpRequest.body;

      const accessToken = await this.addAccount.add({ name, email, password });

      return created({ accessToken });
    } catch (error) {
      return serverError();
    }
  }
}
