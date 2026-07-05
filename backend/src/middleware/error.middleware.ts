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
    console.error(err.name, err.code, err.cause ?? err.message);
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: ERROR_CODES.INTERNAL_ERROR.message,
  });
};
