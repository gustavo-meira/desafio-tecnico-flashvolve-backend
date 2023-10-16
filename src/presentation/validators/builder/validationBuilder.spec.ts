import { ValidationBuilder as sut } from './validationBuilder';
import { RequiredFieldValidation } from '..';
import { Chance } from 'chance';

const chance = new Chance();

const fieldName = chance.word();

describe('ValidationBuilder', () => {
  it('Should return RequiredFieldValidation', () => {
    const validations = sut.field(fieldName).required().build();

    expect(validations).toEqual([new RequiredFieldValidation(fieldName)]);
  });
});
