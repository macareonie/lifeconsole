import { type Request, type Response } from "express";
import { type Session } from "@supabase/supabase-js";

export const AUTH_ACCESS_COOKIE = "lc-access-token";
export const AUTH_REFRESH_COOKIE = "lc-refresh-token";
export const AUTH_EXPIRES_AT_COOKIE = "lc-expires-at";

const cookieOptions = (maxAgeMs: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: maxAgeMs,
});

const clearCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

const parseCookieHeader = (cookieHeader: string | undefined) => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [rawName, ...rawValueParts] = part.trim().split("=");

    if (!rawName || rawValueParts.length === 0) {
      return cookies;
    }

    cookies[decodeURIComponent(rawName)] = decodeURIComponent(rawValueParts.join("="));
    return cookies;
  }, {});
};

export const setAuthCookies = (res: Response, session: Session) => {
  const expiresAtMs = session.expires_at ? session.expires_at * 1000 : Date.now();
  const maxAgeMs = Math.max(expiresAtMs - Date.now(), 0);

  // Keep the tokens in HttpOnly cookies so browser JavaScript never owns them.
  res.cookie(AUTH_ACCESS_COOKIE, session.access_token, cookieOptions(maxAgeMs));
  res.cookie(AUTH_REFRESH_COOKIE, session.refresh_token, cookieOptions(maxAgeMs));
  res.cookie(AUTH_EXPIRES_AT_COOKIE, String(session.expires_at ?? Math.floor(expiresAtMs / 1000)), cookieOptions(maxAgeMs));
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(AUTH_ACCESS_COOKIE, clearCookieOptions);
  res.clearCookie(AUTH_REFRESH_COOKIE, clearCookieOptions);
  res.clearCookie(AUTH_EXPIRES_AT_COOKIE, clearCookieOptions);
};

export const getAuthCookieTokens = (req: Request) => {
  const cookies = parseCookieHeader(req.headers.cookie);

  return {
    accessToken: cookies[AUTH_ACCESS_COOKIE],
    refreshToken: cookies[AUTH_REFRESH_COOKIE],
    expiresAt: cookies[AUTH_EXPIRES_AT_COOKIE],
  };
};