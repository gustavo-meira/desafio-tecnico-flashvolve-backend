import { DBAddAccount } from '@/data/usecases/addAccount/dbAddAccount';
import { BcryptAdapter } from '@/infra/crypto/bcryptAdapter/bcryptAdapter';
import { SignUpController } from '@/presentation/controllers/signup/signup';
import { AccountPrismaRepo } from '@/infra/db/prisma/accountRepo/accountRepo';
import { makeSignUpValidations } from './signupValidations';
import { JwtAdapter } from '@/infra/crypto/jwtAdapter/jwtAdapter';

export const makeSignUpController = (): SignUpController => {
  const secret = process.env.JWT_SECRET;

  const bcryptAdapter = new BcryptAdapter();
  const accountPrismaRepo = new AccountPrismaRepo();
  const jwtAdapter = new JwtAdapter(secret);

  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountPrismaRepo, jwtAdapter);

  const validations = makeSignUpValidations();

  const signUpController = new SignUpController(dbAddAccount, validations);

  return signUpController;
};
