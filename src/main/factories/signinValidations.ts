import { type Validation } from '@/presentation/protocols';
import { ValidationBuilder, ValidationComposite } from '@/presentation/validators';

export const makeSignInValidations = (): Validation => {
  const emailValidations = ValidationBuilder.field('email').required().email().build();
  const passwordValidations = ValidationBuilder.field('password').required().build();

  return new ValidationComposite([
    ...emailValidations,
    ...passwordValidations,
  ]);
};
