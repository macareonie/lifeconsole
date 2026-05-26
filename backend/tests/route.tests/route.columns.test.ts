import request from "supertest";
import app from "../../src/app.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbFrom, getUser } = vi.hoisted(() => ({
  dbFrom: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("../../src/config/db.js", () => ({
  db: {
    from: dbFrom,
  },
  createFreshClient: vi.fn(() => ({
    auth: {
      getUser,
    },
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  getUser.mockResolvedValue({
    data: { user: { id: "user-1", email: "user@example.com" } },
    error: null,
  });
});

describe("columns routes (auth protected)", () => {
  it("rejects unauthenticated calls", async () => {
    const res = await request(app).get("/api/columns/board/1");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication token missing" });
  });

  it("returns columns for an authenticated board request", async () => {
    dbFrom.mockImplementation((table: string) => {
      if (table === "columns") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [{ id: 11, title: "Todo", board_id: 1, position: 0 }],
            error: null,
          }),
        };
      }

      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const res = await request(app)
      .get("/api/columns/board/1")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([
      { id: 11, title: "Todo", board_id: 1, position: 0 },
    ]);
  });
});
