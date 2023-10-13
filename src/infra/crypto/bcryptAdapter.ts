import bcrypt from 'bcrypt';
import { type Encrypter } from '../../data/protocols/encrypter';

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt = 12) {}

  async encrypt (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt);

    return null;
  }
}
