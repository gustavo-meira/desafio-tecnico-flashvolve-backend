import jwt from 'jsonwebtoken';
import { type TokenGenerator } from '@/data/protocols/tokenGenerator';
import { type TokenDecrypter } from '@/data/protocols/tokenDecrypter';

export class JwtAdapter implements TokenGenerator, TokenDecrypter {
  constructor (private readonly secret: string) {}

  generate (id: string): string {
    const token = jwt.sign({ id }, this.secret);

    return token;
  }

  async decrypt (value: string): Promise<string> {
    jwt.verify(value, this.secret);

    return null;
  };
}
