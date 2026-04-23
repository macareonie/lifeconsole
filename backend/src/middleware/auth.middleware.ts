import { type Request, type Response, type NextFunction } from "express";
import { db } from "../config/db.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const { data, error } = await db.auth.getUser(token);

  if (error || !data) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  (req as any).user = data.user;
  next();
};
