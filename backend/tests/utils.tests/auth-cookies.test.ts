import { describe, expect, it, vi } from "vitest";
import { clearAuthCookies, getAuthCookieTokens, setAuthCookies } from "../../src/utils/auth-cookies.js";

describe("auth-cookies", () => {
  it("returns empty tokens when cookie header is missing", () => {
    const req = { headers: {} } as any;

    expect(getAuthCookieTokens(req)).toEqual({
      accessToken: undefined,
      refreshToken: undefined,
      expiresAt: undefined,
    });
  });

  it("parses encoded cookie values and ignores malformed parts", () => {
    const req = {
      headers: {
        cookie: "bad; lc-access-token=access%20token; lc-refresh-token=refresh%2Ftoken; lc-expires-at=123",
      },
    } as any;

    expect(getAuthCookieTokens(req)).toEqual({
      accessToken: "access token",
      refreshToken: "refresh/token",
      expiresAt: "123",
    });
  });

  it("sets auth cookies with a fallback expires_at value when missing", () => {
    const cookie = vi.fn();
    const res = { cookie } as any;

    setAuthCookies(res, {
      access_token: "access",
      refresh_token: "refresh",
    } as any);

    expect(cookie).toHaveBeenCalledTimes(3);
  });

  it("clears all auth cookies", () => {
    const clearCookie = vi.fn();
    const res = { clearCookie } as any;

    clearAuthCookies(res);

    expect(clearCookie).toHaveBeenCalledTimes(3);
  });
});
