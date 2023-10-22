import { type AccountModel } from '../usecases/addAccount/dbAddAccountProtocols';

export interface LoadAccountByIdRepository {
  loadById: (id: string) => Promise<AccountModel>;
}
