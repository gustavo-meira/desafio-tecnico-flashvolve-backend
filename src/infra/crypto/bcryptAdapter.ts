import bcrypt from 'bcrypt';
import { type Hasher } from '../../data/protocols/hasher';

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt = 12) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);

    return hash;
  }
}
