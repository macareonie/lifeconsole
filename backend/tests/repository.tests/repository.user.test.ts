import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/db.js", () => ({ db: { from: vi.fn() } }));
import { db } from "../../src/config/db.js";
import * as userRepo from "../../src/repositories/user.repository.js";

beforeEach(() => vi.clearAllMocks());

describe("user.repository", () => {
  it("checkUserExists returns exists=false when no data", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    (db.from as any).mockReturnValue(chain);
    const out = await userRepo.checkUserExists("x@x.com");
    expect(out.exists).toBe(false);
  });
});
