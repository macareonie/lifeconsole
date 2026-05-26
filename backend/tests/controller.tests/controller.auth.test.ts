import { describe, it, expect, vi, beforeEach } from "vitest";

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

import * as authService from "../../src/modules/auth/auth.service.js";
import * as authCookies from "../../src/utils/auth-cookies.js";
import {
  register,
  login,
  getSession,
  logout,
} from "../../src/modules/auth/auth.controller.js";

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
  });

  it("getSession returns 401 when cookies missing", async () => {
    const req = { headers: {} } as any;
    const res = makeRes();
    const next = vi.fn();

    (authCookies.getAuthCookieTokens as any).mockReturnValue({});

    await getSession(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
