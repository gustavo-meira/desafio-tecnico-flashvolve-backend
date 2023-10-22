import { type Validation } from '@/presentation/protocols';
import { ValidationBuilder, ValidationComposite } from '@/presentation/validators';

export const makeLoadAllMessagesValidations = (): Validation => {
  const chatIdValidations = ValidationBuilder.field('chatId').required().build();

  return new ValidationComposite([
    ...chatIdValidations,
  ]);
};
