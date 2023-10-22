import { DbLoadAccountByToken } from '@/data/usecases/loadAccountByToken/dbLoadAccountByToken';
import { JwtAdapter } from '@/infra/crypto/jwtAdapter/jwtAdapter';
import { AccountPrismaRepo } from '@/infra/db/prisma/accountRepo/accountRepo';
import { AuthMiddleware } from '@/presentation/middlewares/auth';

const makeAuthMiddleware = (): AuthMiddleware => {
  const jwtSecret = process.env.JWT_SECRET;

  const jwtAdapter = new JwtAdapter(jwtSecret);
  const accountPrismaRepo = new AccountPrismaRepo();

  const dbLoadAccountByToken = new DbLoadAccountByToken(jwtAdapter, accountPrismaRepo);

  return new AuthMiddleware(dbLoadAccountByToken);
};

export const authMiddleware = makeAuthMiddleware();
