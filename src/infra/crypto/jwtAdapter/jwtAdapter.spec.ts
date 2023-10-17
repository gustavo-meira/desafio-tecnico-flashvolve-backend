import { JwtAdapter } from './jwtAdapter';
import jwt from 'jsonwebtoken';
import Chance from 'chance';

const chance = new Chance();

const signedValue = chance.string();
const jwtSecret = chance.string();

jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return signedValue;
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
});
