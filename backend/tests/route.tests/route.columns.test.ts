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

  it("returns a column for GET /api/columns/:id", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { id: 11, title: "Todo", board_id: 1, position: 0 },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "columns") {
        return { select };
      }

      return { select: vi.fn() };
    });

    const res = await request(app)
      .get("/api/columns/11")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      id: 11,
      title: "Todo",
      board_id: 1,
      position: 0,
    });
    expect(eq).toHaveBeenCalledWith("id", 11);
  });

  it("creates a column with POST /api/columns", async () => {
    const insert = vi.fn().mockResolvedValue({ data: [], error: null });

    dbFrom.mockImplementation((table: string) => {
      if (table === "columns") {
        return { insert };
      }

      return { insert: vi.fn() };
    });

    const res = await request(app)
      .post("/api/columns")
      .set("Cookie", "lc-access-token=valid-token")
      .send({ title: "Todo", boardId: 1, position: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Column created successfully",
      success: true,
    });
    expect(insert).toHaveBeenCalledWith({
      title: "Todo",
      board_id: 1,
      position: 1,
    });
  });

  it("updates a column with PUT /api/columns/:id", async () => {
    const eq = vi.fn().mockResolvedValue({ data: [], error: null });
    const update = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "columns") {
        return { update };
      }

      return { update: vi.fn() };
    });

    const res = await request(app)
      .put("/api/columns/11")
      .set("Cookie", "lc-access-token=valid-token")
      .send({ title: "Done", position: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Column updated successfully",
      success: true,
    });
    expect(update).toHaveBeenCalledWith({ title: "Done", position: 2 });
    expect(eq).toHaveBeenCalledWith("id", 11);
  });

  it("deletes a column with DELETE /api/columns/:id", async () => {
    const eq = vi.fn().mockResolvedValue({ data: [], error: null });
    const del = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "columns") {
        return { delete: del };
      }

      return { delete: vi.fn() };
    });

    const res = await request(app)
      .delete("/api/columns/11")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Column deleted successfully",
      success: true,
    });
    expect(eq).toHaveBeenCalledWith("id", 11);
  });
});
