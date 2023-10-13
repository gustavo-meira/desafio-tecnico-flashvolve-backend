import { EmailValidatorAdapter } from './emailValidationAdapter';
import validator from 'validator';

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

    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  it('Should return true if zod return true', () => {
    const sut = makeSut();

    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid('any_email@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});