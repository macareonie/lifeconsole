import { describe, it, expect, beforeEach, vi } from "vitest";

describe("config db", () => {
  beforeEach(() => {
    vi.resetModules();
    // ensure env values exist for import
    process.env.SUPABASE_URL = "http://supabase.test";
    process.env.SUPABASE_KEY = "test-key";
  });

  it("calls createClient on import and createFreshClient includes auth options", async () => {
    vi.mock("@supabase/supabase-js", () => ({
      createClient: vi.fn(() => ({ from: vi.fn() })),
    }));

    const supabase = await import("@supabase/supabase-js");
    const dbMod = await import("../../src/config/db.js");

    expect(supabase.createClient).toHaveBeenCalled();
    expect(supabase.createClient).toHaveBeenCalledWith(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );

    // calling createFreshClient should call createClient again with options
    dbMod.createFreshClient();
    expect(supabase.createClient).toHaveBeenCalledWith(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      expect.objectContaining({ auth: expect.any(Object) }),
    );
  });
});
