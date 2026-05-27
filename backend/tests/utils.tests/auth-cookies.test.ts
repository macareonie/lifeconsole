import { afterEach, describe, expect, it, vi } from "vitest";

const loadAuthCookies = async () => {
  vi.resetModules();
  return import("../../src/utils/auth-cookies.js");
};

afterEach(() => {
  process.env.FRONTEND_MODE = "dev";
  vi.resetModules();
});

describe("auth-cookies", () => {
  it("returns empty tokens when cookie header is missing", async () => {
    const { getAuthCookieTokens } = await loadAuthCookies();
    const req = { headers: {} } as any;

    expect(getAuthCookieTokens(req)).toEqual({
      accessToken: undefined,
      refreshToken: undefined,
      expiresAt: undefined,
    });
  });

  it("parses encoded cookie values and ignores malformed parts", async () => {
    const { getAuthCookieTokens } = await loadAuthCookies();
    const req = {
      headers: {
        cookie:
          "bad; lc-access-token=access%20token; lc-refresh-token=refresh%2Ftoken; lc-expires-at=123",
      },
    } as any;

    expect(getAuthCookieTokens(req)).toEqual({
      accessToken: "access token",
      refreshToken: "refresh/token",
      expiresAt: "123",
    });
  });

  it("uses lax cookies in development", async () => {
    process.env.FRONTEND_MODE = "dev";
    const { setAuthCookies, clearAuthCookies } = await loadAuthCookies();
    const cookie = vi.fn();
    const clearCookie = vi.fn();
    const res = { cookie, clearCookie } as any;

    setAuthCookies(res, {
      access_token: "access",
      refresh_token: "refresh",
    } as any);

    expect(cookie).toHaveBeenCalledTimes(3);
    expect(cookie).toHaveBeenCalledWith(
      "lc-access-token",
      "access",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      }),
    );

    clearAuthCookies(res);

    expect(clearCookie).toHaveBeenCalledWith(
      "lc-access-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
      }),
    );
  });

  it("uses cross-site-safe cookies in production", async () => {
    process.env.FRONTEND_MODE = "prod";
    const { setAuthCookies, clearAuthCookies } = await loadAuthCookies();
    const cookie = vi.fn();
    const clearCookie = vi.fn();
    const res = { cookie, clearCookie } as any;

    setAuthCookies(res, {
      access_token: "access",
      refresh_token: "refresh",
    } as any);

    expect(cookie).toHaveBeenCalledTimes(3);
    expect(cookie).toHaveBeenCalledWith(
      "lc-access-token",
      "access",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      }),
    );

    clearAuthCookies(res);

    expect(clearCookie).toHaveBeenCalledWith(
      "lc-access-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      }),
    );
  });
});
