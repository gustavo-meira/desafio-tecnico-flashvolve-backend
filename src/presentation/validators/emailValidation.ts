import { InvalidParamError } from '../errors';
import { type InputValidation, type Validation } from './validation';

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: InputValidation): Error | null {
    return new InvalidParamError(this.fieldName);
  }
}
