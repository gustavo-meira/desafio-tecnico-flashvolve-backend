import { MissingParamError } from '../errors';
import { type InputValidation, type Validation } from './validation';

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: InputValidation): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }

    return null;
  }
}
