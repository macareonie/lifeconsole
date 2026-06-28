import { ERROR_CODES } from "./error-codes.js";

import type { ErrorCode } from "./error-codes.js";
export class ServiceError extends Error {
  public code: ErrorCode;
  public cause?: unknown;
  public statusCode: number;

  constructor(name: string, code: ErrorCode, cause?: unknown) {
    const { statusCode, message } = ERROR_CODES[code];
    super(message);
    this.name = name;
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;
  }
}
