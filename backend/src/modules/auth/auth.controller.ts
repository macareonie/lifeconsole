import { type NextFunction, type Request, type Response } from "express";
import { type Session } from "@supabase/supabase-js";
import { db } from "../../config/db.js";
import {
  clearAuthCookies,
  getAuthCookieTokens,
  setAuthCookies,
} from "../../utils/auth-cookies.js";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserFromAccessToken,
} from "./auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email, password } = req.body;
  try {
    const result = await registerUser(username, email, password);

    if (result.session) {
      setAuthCookies(res, result.session as Session);
    }
    console.log(result.message);
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

    if (result.session) {
      setAuthCookies(res, result.session as Session);
    }
    console.log(result.message);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken, refreshToken, expiresAt } = getAuthCookieTokens(req);

    if (!accessToken || !refreshToken || !expiresAt) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { data, error } = await getUserFromAccessToken(accessToken);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    return res.status(200).json({
      session: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Number(expiresAt),
        expires_in: Math.max(
          Number(expiresAt) - Math.floor(Date.now() / 1000),
          0,
        ),
        token_type: "bearer",
        user: data.user,
      } as Session,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await logoutUser();
    clearAuthCookies(res);
    console.log(result.message);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
