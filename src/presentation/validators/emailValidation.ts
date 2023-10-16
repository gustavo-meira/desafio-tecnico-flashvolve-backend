import { InvalidParamError } from '../errors';
import { type InputValidation, type Validation } from './validation';

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: InputValidation): Error | null {
    if (!input[this.fieldName]) {
      return null;
    }

    return new InvalidParamError(this.fieldName);
  }
}
