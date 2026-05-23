import { type Request, type Response, type NextFunction } from "express";
import { createFreshClient } from "../config/db.js";
import { getAuthCookieTokens } from "../utils/auth-cookies.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken } = getAuthCookieTokens(req);

  if (!accessToken) {
    return res.status(401).json({ error: "Authentication token missing" });
  }

  const authClient = createFreshClient();
  const { data, error } = await authClient.auth.getUser(accessToken);

  if (error || !data) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data.user;
  next();
};
