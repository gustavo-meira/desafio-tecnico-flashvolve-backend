export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Missing params: ${paramName}`);
    this.name = 'InvalidParamError';
  }
}
