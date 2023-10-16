import { type InputValidation, type Validation } from '../../protocols/validation';
import { ValidationComposite } from './validationComposite';
import Chance from 'chance';

const chance = new Chance();

const fieldsToValidate = {
  field1: chance.word(),
  field2: chance.word(),
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: InputValidation): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  it('Should returns an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    const error = sut.validate(fieldsToValidate);

    expect(error).toEqual(new Error());
  });

  it('Should return falsy if all validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate(fieldsToValidate);

    expect(error).toBeFalsy();
  });
});
