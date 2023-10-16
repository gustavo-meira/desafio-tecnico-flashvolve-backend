import { InvalidParamError } from '../../errors';
import { EmailValidation } from './emailValidation';
import Chance from 'chance';

const chance = new Chance();

const fieldName = chance.word();

const makeSut = (): EmailValidation => {
  const sut = new EmailValidation(fieldName);

  return sut;
};

describe('Email Validation', () => {
  it('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      [fieldName]: chance.word(),
    });
    expect(error).toEqual(new InvalidParamError(fieldName));
  });

  it('Should return falsy if email is empty', () => {
    const sut = makeSut();

    const error = sut.validate({
      [fieldName]: '',
    });
    expect(error).toBeFalsy();
  });

  it('Should return falsy if validation succeeds', () => {
    const sut = makeSut();

    const error = sut.validate({
      [fieldName]: chance.email(),
    });
    expect(error).toBeFalsy();
  });
});
