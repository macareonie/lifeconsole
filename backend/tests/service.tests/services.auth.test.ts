import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/db.js", () => ({
  createFreshClient: vi.fn(),
}));

vi.mock("../../src/repositories/user.repository.js", () => ({
  addUser: vi.fn(),
  checkUserExists: vi.fn(),
  getUserEmailByUsername: vi.fn(),
}));

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserFromAccessToken,
} from "../../src/modules/auth/auth.service.js";
import { createFreshClient } from "../../src/config/db.js";
import {
  addUser,
  checkUserExists,
  getUserEmailByUsername,
} from "../../src/repositories/user.repository.js";
import { ServiceError } from "../../src/errors/service.error.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth.service", () => {
  it("registerUser - success path", async () => {
    (checkUserExists as any).mockResolvedValue({
      exists: false,
      hasError: false,
    });
    const fakeAuth = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: { access_token: "t" } },
          error: null,
        }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);
    (addUser as any).mockResolvedValue({ error: null });

    const res = await registerUser("bob", "bob@example.com", "password123");

    expect(res.success).toBe(true);
    expect(res.session).toBeDefined();
  });

  it("registerUser - user lookup error throws", async () => {
    (checkUserExists as any).mockResolvedValue({
      exists: false,
      hasError: true,
    });

    await expect(
      registerUser("bob", "bob@example.com", "password123"),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("registerUser - existing user throws ServiceError", async () => {
    (checkUserExists as any).mockResolvedValue({
      exists: true,
      hasError: false,
    });

    await expect(
      registerUser("bob", "bob@example.com", "pw"),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("registerUser - sign up error throws", async () => {
    (checkUserExists as any).mockResolvedValue({
      exists: false,
      hasError: false,
    });
    const fakeAuth = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "signup failed" },
        }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    await expect(
      registerUser("bob", "bob@example.com", "password123"),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("registerUser - add user error throws", async () => {
    (checkUserExists as any).mockResolvedValue({
      exists: false,
      hasError: false,
    });
    const fakeAuth = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: { access_token: "t" } },
          error: null,
        }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);
    (addUser as any).mockResolvedValue({ error: { message: "insert failed" } });

    await expect(
      registerUser("bob", "bob@example.com", "password123"),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("loginUser - success path", async () => {
    (getUserEmailByUsername as any).mockResolvedValue({
      email: "bob@example.com",
      hasError: false,
    });
    const fakeAuth = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { session: { access_token: "t" } },
          error: null,
        }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    const res = await loginUser("bob", "password123");
    expect(res.success).toBe(true);
    expect(res.session).toBeDefined();
  });

  it("loginUser - user lookup error throws", async () => {
    (getUserEmailByUsername as any).mockResolvedValue({
      email: null,
      hasError: true,
    });

    await expect(loginUser("bob", "password123")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("loginUser - missing email throws", async () => {
    (getUserEmailByUsername as any).mockResolvedValue({
      email: null,
      hasError: false,
    });

    await expect(loginUser("bob", "password123")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("loginUser - sign in error throws", async () => {
    (getUserEmailByUsername as any).mockResolvedValue({
      email: "bob@example.com",
      hasError: false,
    });
    const fakeAuth = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "login failed" },
        }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    await expect(loginUser("bob", "password123")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("getUserFromAccessToken - forwards supabase result", async () => {
    const fakeAuth = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: 1 } }, error: null }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    const out = await getUserFromAccessToken("token-abc");
    expect(out.data.user).toBeDefined();
  });

  it("getUserFromAccessToken - error throws", async () => {
    const fakeAuth = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: null, error: { message: "bad token" } }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    await expect(getUserFromAccessToken("token-abc")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("logoutUser - success path", async () => {
    const fakeAuth = {
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    const res = await logoutUser();
    expect(res.success).toBe(true);
  });

  it("logoutUser - throws ServiceError when signOut errors", async () => {
    const fakeAuth = {
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: { message: "boom" } }),
      },
    };
    (createFreshClient as any).mockReturnValue(fakeAuth);

    await expect(logoutUser()).rejects.toBeInstanceOf(ServiceError);
  });
});
