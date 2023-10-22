import { BcryptAdapter } from '@/infra/crypto/bcryptAdapter/bcryptAdapter';
import { AccountPrismaRepo } from '@/infra/db/prisma/accountRepo/accountRepo';
import { SignInController } from '@/presentation/controllers/signin/sigin';
import { DbAuthentication } from '@/data/usecases/authentication/dbAuthentication';
import { JwtAdapter } from '@/infra/crypto/jwtAdapter/jwtAdapter';
import { makeSignInValidations } from './signinValidations';

export const makeSignInController = (): SignInController => {
  const jwtSecret = process.env.JWT_SECRET;

  const jwtAdapter = new JwtAdapter(jwtSecret);
  const loadAccountByEmailRepo = new AccountPrismaRepo();
  const bcryptAdapter = new BcryptAdapter();

  const authentication = new DbAuthentication(loadAccountByEmailRepo, bcryptAdapter, jwtAdapter);

  const validations = makeSignInValidations();

  const signInController = new SignInController(authentication, validations);

  return signInController;
};
