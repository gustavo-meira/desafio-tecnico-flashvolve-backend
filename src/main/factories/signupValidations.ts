import { type Validation, ValidationBuilder, ValidationComposite } from '@/presentation/validators';

export const makeSignUpValidations = (): Validation => {
  const nameValidations = ValidationBuilder.field('name').required().build();
  const emailValidations = ValidationBuilder.field('email').required().email().build();
  const passwordValidations = ValidationBuilder.field('password').required().build();
  const passwordConfirmationValidations = ValidationBuilder.field('passwordConfirmation').required().sameAs('password').build();

  return new ValidationComposite([
    ...nameValidations,
    ...emailValidations,
    ...passwordValidations,
    ...passwordConfirmationValidations,
  ]);
};
