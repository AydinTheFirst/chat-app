export class DactolyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DactolyError';
    Object.setPrototypeOf(this, DactolyError.prototype);
  }
}
