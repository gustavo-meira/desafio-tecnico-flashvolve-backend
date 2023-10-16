import { type InputValidation, type Validation } from '@/presentation/protocols';

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: InputValidation): Error | null {
    for (const validations of this.validations) {
      const error = validations.validate(input);

      if (error) {
        return error;
      }
    }

    return null;
  }
}
