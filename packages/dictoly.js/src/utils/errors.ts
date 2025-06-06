export class DictolyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DictolyError';
    Object.setPrototypeOf(this, DictolyError.prototype);
  }
}
