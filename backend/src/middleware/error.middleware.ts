import { type Request, type Response, type NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .send(err.message || "Internal Server Error");
};
