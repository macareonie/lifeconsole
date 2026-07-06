import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../src/app.js";

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

    const res = await request(app).post("/api/cards").send(payload);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication token missing" });
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
