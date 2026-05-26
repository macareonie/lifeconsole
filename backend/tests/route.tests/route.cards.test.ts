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

describe("cards routes (auth protected)", () => {
  it("rejects unauthenticated calls", async () => {
    const res = await request(app).get("/api/cards/board/1");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication token missing" });
  });

  it("returns cards for an authenticated board request", async () => {
    dbFrom.mockImplementation((table: string) => {
      if (table === "cards") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [
              {
                id: 51,
                title: "Ship tests",
                subtitle: "Route coverage",
                column_id: 11,
                position: 0,
                metadata: {},
                columns: { id: 11, board_id: 1 },
              },
            ],
            error: null,
          }),
        };
      }

      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const res = await request(app)
      .get("/api/cards/board/1")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([
      {
        id: 51,
        title: "Ship tests",
        subtitle: "Route coverage",
        column_id: 11,
        position: 0,
        metadata: {},
      },
    ]);
  });
});
