import { type AccountModel } from '@/domain/models/account';
import { type AddAccountModel } from '@/domain/useCases/addAccount';

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>;
}
