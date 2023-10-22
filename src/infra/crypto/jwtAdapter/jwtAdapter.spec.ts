import { JwtAdapter } from './jwtAdapter';
import jwt from 'jsonwebtoken';
import Chance from 'chance';

const chance = new Chance();

const signedValue = chance.string();
const jwtSecret = chance.string();
const tokenToReceive = chance.string();
const tokenDecrypted = chance.string();

jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return signedValue;
  },
  verify: (): string => {
    return tokenDecrypted;
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(jwtSecret);
};

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    const valueToSign = chance.string();

    sut.generate(valueToSign);
    expect(signSpy).toHaveBeenCalledWith({ id: valueToSign }, jwtSecret);
  });

  it('Should return a token on sign success', () => {
    const sut = makeSut();

    const token = sut.generate(chance.string());
    expect(token).toBe(signedValue);
  });

  it('Should throw if sign throws', () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.generate).toThrow();
  });

  it('Should call verify with correct values', async () => {
    const sut = makeSut();
    const verifySpy = jest.spyOn(jwt, 'verify');

    await sut.decrypt(tokenToReceive);
    expect(verifySpy).toHaveBeenCalledWith(tokenToReceive, jwtSecret);
  });

  it('Should return a value on verify success', async () => {
    const sut = makeSut();

    const value = await sut.decrypt(tokenToReceive);
    expect(value).toBe(tokenDecrypted);
  });

  it('Should return null if verify throws JSONWebTokenError', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      const error = new Error('invalid token');
      error.name = 'JsonWebTokenError';
      throw error;
    });

    const value = await sut.decrypt(tokenToReceive);
    expect(value).toBeNull();
  });

  it('Should return null if verify throws TokenExpiredError', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      const error = new Error('invalid token');
      error.name = 'TokenExpiredError';
      throw error;
    });

    const value = await sut.decrypt(tokenToReceive);
    expect(value).toBeNull();
  });
});
