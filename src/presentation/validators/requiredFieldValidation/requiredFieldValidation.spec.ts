import { RequiredFieldValidation } from './requiredFieldValidation';
import { MissingParamError } from '@/presentation/errors';
import Chance from 'chance';

const chance = new Chance();

const fieldName = chance.word();

const makeSut = (): RequiredFieldValidation => {
  const sut = new RequiredFieldValidation(fieldName);

  return sut;
};

describe('RequiredField Validation', () => {
  it('Should return a missing param error if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      name: chance.name(),
    });
    expect(error).toEqual(new MissingParamError(fieldName));
  });

  it('Should return falsy if validation succeeds', () => {
    const sut = makeSut();

    const error = sut.validate({
      [fieldName]: chance.name(),
    });
    expect(error).toBeFalsy();
  });
});
