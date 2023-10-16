export type InputValidation = Record<string, string | number>;

export interface Validation {
  validate: (input: InputValidation) => Error | null;
}
