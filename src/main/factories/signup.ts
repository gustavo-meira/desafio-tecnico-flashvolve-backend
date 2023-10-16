import { DBAddAccount } from '@/data/usecases/addAccount/dbAddAccount';
import { BcryptAdapter } from '@/infra/crypto/bcryptAdapter/bcryptAdapter';
import { SignUpController } from '@/presentation/controllers/signup/signup';
import { AccountPrismaRepo } from '@/infra/db/prisma/accountRepo/accountRepo';
import { makeSignUpValidations } from './signupValidations';

export const makeSignUpController = (): SignUpController => {
  const bcryptAdapter = new BcryptAdapter();
  const accountPrismaRepo = new AccountPrismaRepo();

  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountPrismaRepo);

  const validations = makeSignUpValidations();

  const signUpController = new SignUpController(dbAddAccount, validations);

  return signUpController;
};
