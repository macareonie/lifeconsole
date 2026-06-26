import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getSession,
  login,
  logout,
  register,
} from "../../src/modules/auth/auth.controller.js";
import * as authService from "../../src/modules/auth/auth.service.js";
import * as authCookies from "../../src/utils/auth-cookies.js";

vi.mock("../../src/modules/auth/auth.service.js", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  getUserFromAccessToken: vi.fn(),
}));

vi.mock("../../src/utils/auth-cookies.js", () => ({
  setAuthCookies: vi.fn(),
  getAuthCookieTokens: vi.fn(),
  clearAuthCookies: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("auth.controller", () => {
  it("register calls service and sets cookies when session present", async () => {
    (authService.registerUser as any).mockResolvedValue({
      session: { access_token: "t" },
      message: "ok",
    });
    const req = {
      body: { username: "bob", email: "b@b.com", password: "pw" },
    } as any;
    const res = makeRes();
    const next = vi.fn();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status().json).toHaveBeenCalled();
    expect(authCookies.setAuthCookies).toHaveBeenCalled();
  });

  it("register skips cookie setup when session is absent", async () => {
    (authService.registerUser as any).mockResolvedValue({
      session: null,
      message: "ok",
    });
    const req = {
      body: { username: "bob", email: "b@b.com", password: "pw" },
    } as any;
    const res = makeRes();
    const next = vi.fn();

    await register(req, res, next);

    expect(authCookies.setAuthCookies).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("register forwards service errors to next", async () => {
    const error = new Error("boom");
    (authService.registerUser as any).mockRejectedValue(error);
    const req = {
      body: { username: "bob", email: "b@b.com", password: "pw" },
    } as any;
    const res = makeRes();
    const next = vi.fn();

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getSession returns 401 when cookies missing", async () => {
    const req = { headers: {} } as any;
    const res = makeRes();
    const next = vi.fn();

    (authCookies.getAuthCookieTokens as any).mockReturnValue({});

    await getSession(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("getSession returns 200 when session cookie data is valid", async () => {
    (authCookies.getAuthCookieTokens as any).mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh",
      expiresAt: String(Math.floor(Date.now() / 1000) + 60),
    });
    (authService.getUserFromAccessToken as any).mockResolvedValue({
      data: { user: { id: 1, email: "bob@example.com" } },
      error: null,
    });

    const req = { headers: {} } as any;
    const res = makeRes();
    const next = vi.fn();

    await getSession(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true }),
    );
  });

  it("getSession returns 401 when access token validation fails", async () => {
    (authCookies.getAuthCookieTokens as any).mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh",
      expiresAt: String(Math.floor(Date.now() / 1000) + 60),
    });
    (authService.getUserFromAccessToken as any).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const req = { headers: {} } as any;
    const res = makeRes();
    const next = vi.fn();

    await getSession(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.status().json).toHaveBeenCalledWith({
      error: "Invalid or expired session",
    });
  });

  it("getSession forwards unexpected errors to next", async () => {
    const error = new Error("boom");
    (authCookies.getAuthCookieTokens as any).mockImplementation(() => {
      throw error;
    });
    const req = { headers: {} } as any;
    const res = makeRes();
    const next = vi.fn();

    await getSession(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("login calls service and sets cookies when session present", async () => {
    (authService.loginUser as any).mockResolvedValue({
      session: { access_token: "t" },
      message: "ok",
    });
    const req = { body: { username: "bob", password: "pw" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status().json).toHaveBeenCalled();
    expect(authCookies.setAuthCookies).toHaveBeenCalled();
  });

  it("login skips cookie setup when session is absent", async () => {
    (authService.loginUser as any).mockResolvedValue({
      session: null,
      message: "ok",
    });
    const req = { body: { username: "bob", password: "pw" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await login(req, res, next);

    expect(authCookies.setAuthCookies).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("login forwards service errors to next", async () => {
    const error = new Error("boom");
    (authService.loginUser as any).mockRejectedValue(error);
    const req = { body: { username: "bob", password: "pw" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("logout calls service and clears cookies", async () => {
    (authService.logoutUser as any).mockResolvedValue({
      message: "ok",
      success: true,
    });
    const req = {} as any;
    const res = makeRes();
    const next = vi.fn();

    await logout(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status().json).toHaveBeenCalled();
    expect(authCookies.clearAuthCookies).toHaveBeenCalled();
  });

  it("logout forwards service errors to next", async () => {
    const error = new Error("boom");
    (authService.logoutUser as any).mockRejectedValue(error);
    const req = {} as any;
    const res = makeRes();
    const next = vi.fn();

    await logout(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
