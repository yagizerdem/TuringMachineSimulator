export class SyntaxError extends Error {
  public lineNumber: number;

  constructor({
    message,
    lineNumber,
  }: {
    message: string;
    lineNumber: number;
  }) {
    super(message);
    Object.setPrototypeOf(this, SyntaxError.prototype);
    this.lineNumber = lineNumber;
  }
}
