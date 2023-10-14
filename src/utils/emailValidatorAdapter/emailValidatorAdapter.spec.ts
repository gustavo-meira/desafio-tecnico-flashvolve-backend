import { EmailValidatorAdapter } from './emailValidationAdapter';
import validator from 'validator';
import Chance from 'chance';

const chance = new Chance();

jest.mock('validator', () => ({
  isEmail: () => true,
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid(chance.email());
    expect(isValid).toBe(false);
  });

  it('Should return true if zod return true', () => {
    const sut = makeSut();

    const isValid = sut.isValid(chance.email());
    expect(isValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSut();
    const email = chance.email();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid(email);
    expect(isEmailSpy).toHaveBeenCalledWith(email);
  });
});
