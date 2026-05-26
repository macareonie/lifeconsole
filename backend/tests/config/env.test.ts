import { describe, it, expect, beforeEach, vi } from "vitest";

describe("config env", () => {
  beforeEach(() => {
    vi.resetModules();
    // clear env to avoid leakage
    delete process.env.PORT;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_KEY;
    delete process.env.FRONTEND_DEV_URL;
  });

  it("exports values when env variables are present", async () => {
    process.env.PORT = "3001";
    process.env.SUPABASE_URL = "http://supabase.test";
    process.env.SUPABASE_KEY = "test-key";
    process.env.FRONTEND_DEV_URL = "http://localhost:5173";

    const mod = await import("../../src/config/env.js");
    expect(mod.env.PORT).toBe("3001");
    expect(mod.env.SUPABASE_URL).toBe("http://supabase.test");
    expect(mod.env.SUPABASE_KEY).toBe("test-key");
    expect(mod.env.FRONTEND_DEV_URL).toBe("http://localhost:5173");
  });

  it("throws when a required value is missing", async () => {
    process.env.PORT = "3001";
    process.env.SUPABASE_URL = "http://supabase.test";
    // SUPABASE_KEY intentionally empty to trigger the requireEnv check
    process.env.SUPABASE_KEY = "";
    process.env.FRONTEND_DEV_URL = "http://localhost:5173";

    await expect(import("../../src/config/env.js")).rejects.toThrow(
      /Missing required environment variable/,
    );
  });
});
