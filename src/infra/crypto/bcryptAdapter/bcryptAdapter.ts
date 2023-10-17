import bcrypt from 'bcrypt';
import { type Hasher } from '@/data/protocols/hasher';
import { type HashComparer } from '@/data/protocols/hashComparer';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt = 12) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);

    return hash;
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(value, hash);

    return isEqual;
  }
}
