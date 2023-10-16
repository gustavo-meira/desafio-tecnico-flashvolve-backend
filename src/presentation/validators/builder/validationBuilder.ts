import { RequiredFieldValidation, type Validation } from '..';

export class ValidationBuilder {
  constructor (
    private readonly fieldName: string,
    private readonly validations: Validation[],
  ) {}

  static field (fieldName: string): ValidationBuilder {
    return new ValidationBuilder(fieldName, []);
  }

  build (): Validation[] {
    return this.validations;
  }

  required (): ValidationBuilder {
    this.validations.push(new RequiredFieldValidation(this.fieldName));
    return this;
  }
}
