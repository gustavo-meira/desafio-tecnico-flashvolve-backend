import { EmailValidatorAdapter } from './emailValidationAdapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail: () => true,
}));

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  it('Should return true if zod return true', () => {
    const sut = new EmailValidatorAdapter();

    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });
});
