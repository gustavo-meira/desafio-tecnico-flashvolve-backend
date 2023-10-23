import { type Validation } from '@/presentation/protocols';
import { ValidationBuilder, ValidationComposite } from '@/presentation/validators';

export const makeAddMessageValidations = (): Validation => {
  const chatIdValidations = ValidationBuilder.field('chatId').required().build();
  const textValidations = ValidationBuilder.field('text').required().build();

  return new ValidationComposite([
    ...chatIdValidations,
    ...textValidations,
  ]);
};
