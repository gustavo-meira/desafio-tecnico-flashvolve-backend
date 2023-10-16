import jwt from 'jsonwebtoken';
import { type TokenGenerator } from '@/data/protocols/tokenGenerator';

export class JwtAdapter implements TokenGenerator {
  constructor (private readonly secret: string) {}

  generate (id: string): string {
    const token = jwt.sign({ id }, this.secret);

    return token;
  }
}