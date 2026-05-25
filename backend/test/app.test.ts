import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("backend app", () => {
  it("returns the landing page from the root route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Landing page");
  });

  it("rejects invalid registration input", async () => {
    const response = await request(app).post("/api/auth/register").send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "email" }),
      ]),
    );
  });

  it("requires authentication on protected routes", async () => {
    const response = await request(app).get("/api/boards");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Authentication token missing" });
  });
});