import type { Request, Response, NextFunction } from "express";

import { ERROR_CODES } from "../errors/error-codes.js";
import { ServiceError } from "../errors/service.error.js";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ServiceError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: ERROR_CODES.INTERNAL_ERROR.message,
  });
};
