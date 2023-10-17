import { InvalidParamError } from '../../errors';
import { type InputValidation, type Validation } from '@/presentation/protocols';

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}

  validate (input: InputValidation): Error | null {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
