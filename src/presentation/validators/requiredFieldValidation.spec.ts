import { RequiredFieldValidation } from './requiredFieldValidation';
import { MissingParamError } from '@/presentation/errors';
import Chance from 'chance';

const chance = new Chance();

const makeSut = (): RequiredFieldValidation => {
  const sut = new RequiredFieldValidation('field');

  return sut;
};

describe('RequiredField Validation', () => {
  it('Should return a missing param error if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      name: chance.name(),
    });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
