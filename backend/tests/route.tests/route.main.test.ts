import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app.js";

describe("root route", () => {
  it("returns the landing page", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Landing page");
  });
});
