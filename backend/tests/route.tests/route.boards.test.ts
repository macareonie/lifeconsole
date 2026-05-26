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

describe("boards routes (auth protected)", () => {
  it("requires authentication on GET /api/boards", async () => {
    const res = await request(app).get("/api/boards");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication token missing" });
  });

  it("rejects an invalid token before reaching the route handler", async () => {
    getUser.mockResolvedValueOnce({
      data: null,
      error: { message: "invalid token" },
    });

    const res = await request(app)
      .get("/api/boards")
      .set("Cookie", "lc-access-token=invalid-token");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid or expired token" });
  });

  it("returns boards for an authenticated request", async () => {
    dbFrom.mockImplementation((table: string) => {
      if (table === "boards") {
        return {
          select: vi.fn().mockResolvedValue({
            data: [{ id: 1, title: "Roadmap" }],
            error: null,
          }),
        };
      }

      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const res = await request(app)
      .get("/api/boards")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([{ id: 1, title: "Roadmap" }]);
  });

  it("returns one board for GET /api/boards/:id", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { id: 1, title: "Roadmap" },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "boards") {
        return { select };
      }

      return { select: vi.fn() };
    });

    const res = await request(app)
      .get("/api/boards/1")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({ id: 1, title: "Roadmap" });
    expect(select).toHaveBeenCalledWith("id, title");
    expect(eq).toHaveBeenCalledWith("id", 1);
  });

  it("creates a board with POST /api/boards", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { id: 99 },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const selectUserId = vi.fn().mockReturnValue({ eq });
    const insertBoard = vi.fn().mockResolvedValue({ data: [], error: null });

    dbFrom.mockImplementation((table: string) => {
      if (table === "users") {
        return {
          select: selectUserId,
        };
      }

      if (table === "boards") {
        return {
          insert: insertBoard,
        };
      }

      return {
        select: vi.fn(),
      };
    });

    const res = await request(app)
      .post("/api/boards")
      .set("Cookie", "lc-access-token=valid-token")
      .send({ title: "Roadmap" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Board created successfully",
      success: true,
    });
    expect(selectUserId).toHaveBeenCalledWith("id");
    expect(eq).toHaveBeenCalledWith("email", "user@example.com");
    expect(insertBoard).toHaveBeenCalledWith({ title: "Roadmap", user_id: 99 });
  });

  it("rejects POST /api/boards when title is missing", async () => {
    const res = await request(app)
      .post("/api/boards")
      .set("Cookie", "lc-access-token=valid-token")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "title" })]),
    );
  });

  it("updates a board with PUT /api/boards/:id", async () => {
    const eq = vi.fn().mockResolvedValue({ data: [], error: null });
    const update = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "boards") {
        return { update };
      }

      return { update: vi.fn() };
    });

    const res = await request(app)
      .put("/api/boards/1")
      .set("Cookie", "lc-access-token=valid-token")
      .send({ title: "Updated title" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Board updated successfully",
      success: true,
    });
    expect(update).toHaveBeenCalledWith({ title: "Updated title" });
    expect(eq).toHaveBeenCalledWith("id", 1);
  });

  it("deletes a board with DELETE /api/boards/:id", async () => {
    const eq = vi.fn().mockResolvedValue({ data: [], error: null });
    const del = vi.fn().mockReturnValue({ eq });

    dbFrom.mockImplementation((table: string) => {
      if (table === "boards") {
        return { delete: del };
      }

      return { delete: vi.fn() };
    });

    const res = await request(app)
      .delete("/api/boards/1")
      .set("Cookie", "lc-access-token=valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Board deleted successfully",
      success: true,
    });
    expect(eq).toHaveBeenCalledWith("id", 1);
  });
});
