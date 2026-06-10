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

  it("returns a card for GET /api/cards/:id", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: 51,
        title: "Ship tests",
        subtitle: "Route coverage",
        column_id: 11,
        position: 1,
        metadata: { priority: "high" },
      },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "cards") {
        return { select };
      }

      return { select: vi.fn() };
    });

    const res = await request(app)
      .get("/api/cards/51")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      id: 51,
      title: "Ship tests",
      subtitle: "Route coverage",
      column_id: 11,
      position: 1,
      metadata: { priority: "high" },
    });
    expect(eq).toHaveBeenCalledWith("id", 51);
  });

  it("creates a card with POST /api/cards", async () => {
    const insert = vi.fn().mockResolvedValue({ data: [], error: null });

    dbFrom.mockImplementation((table: string) => {
      if (table === "cards") {
        return { insert };
      }

      return { insert: vi.fn() };
    });

    const payload = {
      title: "Ship tests",
      subtitle: "Route coverage",
      column_id: 11,
      position: 1,
      metadata: { priority: "high" },
    };

    const res = await request(app)
      .post("/api/cards")
      .set("Cookie", "lc-access-token=valid-token")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Card created successfully",
      success: true,
    });
    expect(insert).toHaveBeenCalledWith({
      title: payload.title,
      subtitle: payload.subtitle,
      column_id: payload.column_id,
      position: payload.position,
      metadata: payload.metadata,
    });
  });

  it("updates a card with PUT /api/cards/:id", async () => {
    const eq = vi.fn().mockResolvedValue({ data: [], error: null });
    const update = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "cards") {
        return { update };
      }

      return { update: vi.fn() };
    });

    const payload = {
      title: "Ship tests now",
      subtitle: "More coverage",
      column_id: 12,
      position: 2,
      metadata: { priority: "low" },
    };

    const res = await request(app)
      .put("/api/cards/51")
      .set("Cookie", "lc-access-token=valid-token")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Card updated successfully",
      success: true,
    });
    expect(update).toHaveBeenCalledWith(payload);
    expect(eq).toHaveBeenCalledWith("id", 51);
  });

  it("deletes a card with DELETE /api/cards/:id", async () => {
    const eq = vi.fn().mockResolvedValue({ data: [], error: null });
    const del = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "cards") {
        return { delete: del };
      }

      return { delete: vi.fn() };
    });

    const res = await request(app)
      .delete("/api/cards/51")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Card deleted successfully",
      success: true,
    });
    expect(eq).toHaveBeenCalledWith("id", 51);
  });
});
