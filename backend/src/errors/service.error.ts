export class ServiceError extends Error {
  constructor(
    name: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
