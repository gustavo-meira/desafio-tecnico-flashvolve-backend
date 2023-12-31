import { CompareFieldsValidation } from './compareFieldsValidation';
import { InvalidParamError } from '../../errors';
import Chance from 'chance';

const chance = new Chance();

const fieldName = chance.word();
const fieldToCompareName = chance.word();

const makeSut = (): CompareFieldsValidation => {
  const sut = new CompareFieldsValidation(fieldName, fieldToCompareName);

  return sut;
};

describe('CompareFields Validation', () => {
  it('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      [fieldName]: chance.word(),
      [fieldToCompareName]: chance.word(),
    });
    expect(error).toEqual(new InvalidParamError(fieldName));
  });

  it('Should return falsy if validation succeeds', () => {
    const sut = makeSut();
    const fieldValue = chance.word();

    const error = sut.validate({
      [fieldName]: fieldValue,
      [fieldToCompareName]: fieldValue,
    });
    expect(error).toBeFalsy();
  });
});
