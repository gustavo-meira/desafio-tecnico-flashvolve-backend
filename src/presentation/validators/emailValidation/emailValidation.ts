import { InvalidParamError } from '../../errors';
import { type InputValidation, type Validation } from '../validation';

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: InputValidation): Error | null {
    const email = input[this.fieldName] as string;

    if (!email) {
      return null;
    }

    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (!emailRegex.test(email)) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
