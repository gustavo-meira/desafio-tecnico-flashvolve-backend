import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/httpHelpers';
import { type EmailValidator } from '@/presentation/protocols/emailValidator';
import { SignInController } from './sigin';
import Chance from 'chance';

const chance = new Chance();

const signInAccount = {
  email: chance.email(),
  password: chance.string(),
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

interface SutTypes {
  sut: SignInController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignInController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe('SignIn Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        password: signInAccount.password,
      },
    });
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        email: signInAccount.email,
      },
    });
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle({ body: signInAccount });
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(signInAccount.email);
  });

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle({ body: signInAccount });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });
});
