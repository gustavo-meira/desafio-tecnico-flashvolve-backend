import { JwtAdapter } from './jwtAdapter';
import jwt from 'jsonwebtoken';
import Chance from 'chance';

const chance = new Chance();

const signedValue = chance.string();
const jwtSecret = chance.string();

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return await Promise.resolve(signedValue);
  },
}));

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', () => {
    const sut = new JwtAdapter(jwtSecret);
    const signSpy = jest.spyOn(jwt, 'sign');
    const valueToSign = chance.string();

    sut.generate(valueToSign);
    expect(signSpy).toHaveBeenCalledWith({ id: valueToSign }, jwtSecret);
  });
});
