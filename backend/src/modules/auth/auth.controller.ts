import type { Session } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";

import {
  clearAuthCookies,
  getAuthCookieTokens,
  setAuthCookies,
} from "../../utils/auth-cookies.js";
import {
  getUserFromAccessTokenService,
  loginUserService,
  logoutUserService,
  registerUserService,
} from "./auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email, password } = req.body;
  try {
    const result = await registerUserService(username, email, password);

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
    const result = await loginUserService(username, password);

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

    const { data, error } = await getUserFromAccessTokenService(accessToken);

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
    const result = await logoutUserService();
    clearAuthCookies(res);
    console.log(result.message);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
