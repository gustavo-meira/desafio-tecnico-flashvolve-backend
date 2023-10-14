import { DBAddAccount } from '@/data/usecases/addAccount/dbAddAccount';
import { BcryptAdapter } from '@/infra/crypto/bcryptAdapter';
import { SignUpController } from '@/presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '@/utils/emailValidatorAdapter/emailValidationAdapter';
import { AccountPrismaRepo } from '@/infra/db/prisma/accountRepo/accountRepo';

export const makeSignUpController = (): SignUpController => {
  const bcryptAdapter = new BcryptAdapter();
  const accountPrismaRepo = new AccountPrismaRepo();

  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountPrismaRepo);
  const emailValidator = new EmailValidatorAdapter();

  const signUpController = new SignUpController(emailValidator, dbAddAccount);

  return signUpController;
};
