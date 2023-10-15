import { MissingParamError } from '@/presentation/errors';
import { SignInController } from './sigin';
import Chance from 'chance';
import { badRequest } from '@/presentation/helpers/httpHelpers';

const chance = new Chance();

const signInAccount = {
  email: chance.email(),
  password: chance.string(),
};

describe('SignIn Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const sut = new SignInController();

    const httpResponse = await sut.handle({
      body: {
        password: signInAccount.password,
      },
    });
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const sut = new SignInController();

    const httpResponse = await sut.handle({
      body: {
        email: signInAccount.email,
      },
    });
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
