export abstract class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);

    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
