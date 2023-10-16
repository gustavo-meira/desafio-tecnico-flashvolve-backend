import { ValidationBuilder as sut } from './validationBuilder';
import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
} from '..';
import { Chance } from 'chance';

const chance = new Chance();

const fieldName = chance.word();

describe('ValidationBuilder', () => {
  it('Should return RequiredFieldValidation', () => {
    const validations = sut.field(fieldName).required().build();

    expect(validations).toEqual([new RequiredFieldValidation(fieldName)]);
  });

  it('Should return CompareFieldsValidation', () => {
    const fieldToCompare = chance.word();
    const validations = sut.field(fieldName).sameAs(fieldToCompare).build();

    expect(validations).toEqual([new CompareFieldsValidation(fieldName, fieldToCompare)]);
  });

  it('Should return EmailValidation', () => {
    const validations = sut.field(fieldName).email().build();

    expect(validations).toEqual([new EmailValidation(fieldName)]);
  });
});
