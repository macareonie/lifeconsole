import request from "supertest";
import app from "../../src/app.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const signOut = vi.fn();

vi.mock("../../src/config/db.js", () => ({
  db: {
    from: vi.fn(),
  },
  createFreshClient: vi.fn(() => ({
    auth: {
      signOut,
    },
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  signOut.mockResolvedValue({ error: null });
});

describe("auth routes (validation and session)", () => {
  it("rejects invalid registration input with 400 and validation errors", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "email" })]),
    );
  });

  it("rejects invalid login input with 400 and validation errors", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "username" })]),
    );
  });

  it("returns 401 for session when cookies are missing", async () => {
    const res = await request(app).get("/api/auth/session");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Not authenticated" });
  });

  it("logs out successfully", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns an error response when logout fails", async () => {
    signOut.mockResolvedValueOnce({
      error: { message: "logout failed" },
    });

    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "logout failed" });
  });
});
