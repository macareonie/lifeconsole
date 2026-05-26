import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/db.js", () => ({
  createFreshClient: vi.fn(),
}));

vi.mock("../../src/utils/auth-cookies.js", () => ({
  getAuthCookieTokens: vi.fn(),
}));

import { authMiddleware } from "../../src/middleware/auth.middleware.js";
import { createFreshClient } from "../../src/config/db.js";
import { getAuthCookieTokens } from "../../src/utils/auth-cookies.js";

beforeEach(() => {
  vi.clearAllMocks();
});

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("auth.middleware", () => {
  it("returns 401 when no access token", async () => {
    (getAuthCookieTokens as any).mockReturnValue({ accessToken: undefined });
    const req = { headers: {} } as any;
    const res = makeRes();
    const next = vi.fn();

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication token missing",
    });
  });

  it("returns 401 when token invalid", async () => {
    (getAuthCookieTokens as any).mockReturnValue({ accessToken: "t" });
    const fakeAuth = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: 1 } }, error: null }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);
    (fakeAuth.auth.getUser as any).mockResolvedValue({ data: null, error: {} });

    const req = { headers: {} } as any;
    const res = makeRes();
    const next = vi.fn();

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
  });

  it("calls next and attaches user when token valid", async () => {
    (getAuthCookieTokens as any).mockReturnValue({ accessToken: "t" });
    const fakeAuth = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: 1 } }, error: null }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    const req: any = { headers: {} };
    const res = {} as any;
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
