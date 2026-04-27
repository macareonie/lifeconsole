import { type NextFunction, type Request, type Response } from "express";
import { loginUser, registerUser } from "./auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email, password } = req.body;
  try {
    const result = await registerUser(username, email, password);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;
  try {
    const result = await loginUser(username, password);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
