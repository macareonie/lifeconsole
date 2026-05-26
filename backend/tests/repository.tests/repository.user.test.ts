import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/db.js", () => ({ db: { from: vi.fn() } }));
import { db } from "../../src/config/db.js";
import * as userRepo from "../../src/repositories/user.repository.js";

beforeEach(() => vi.clearAllMocks());

describe("user.repository", () => {
  it("addUser inserts username and email", async () => {
    const insert = vi.fn().mockResolvedValue({ data: {}, error: null });
    (db.from as any).mockReturnValue({ insert });

    const result = await userRepo.addUser("bob", "bob@example.com");

    expect(insert).toHaveBeenCalledWith({
      username: "bob",
      email: "bob@example.com",
    });
    expect(result.error).toBeNull();
  });

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

  it("checkUserExists returns exists=true when user exists", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: 1, email: "x@x.com" },
        error: null,
      }),
    };
    (db.from as any).mockReturnValue(chain);

    const out = await userRepo.checkUserExists("x@x.com");

    expect(out.exists).toBe(true);
  });

  it("checkUserExists returns hasError=true when query fails", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: {} }),
    };
    (db.from as any).mockReturnValue(chain);

    const out = await userRepo.checkUserExists("x@x.com");

    expect(out.hasError).toBe(true);
  });

  it("getUserIdByEmail returns user id", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: 9 },
        error: null,
      }),
    };
    (db.from as any).mockReturnValue(chain);

    const out = await userRepo.getUserIdByEmail("x@x.com");

    expect(out.userId).toBe(9);
    expect(out.hasError).toBe(false);
  });

  it("getUserIdByEmail returns hasError=true on query failure", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: {} }),
    };
    (db.from as any).mockReturnValue(chain);

    const out = await userRepo.getUserIdByEmail("x@x.com");

    expect(out.hasError).toBe(true);
  });

  it("getUserEmailByUsername returns email", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { email: "bob@example.com" },
        error: null,
      }),
    };
    (db.from as any).mockReturnValue(chain);

    const out = await userRepo.getUserEmailByUsername("bob");

    expect(out.email).toBe("bob@example.com");
    expect(out.hasError).toBe(false);
  });

  it("getUserEmailByUsername returns hasError=true on query failure", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: {} }),
    };
    (db.from as any).mockReturnValue(chain);

    const out = await userRepo.getUserEmailByUsername("bob");

    expect(out.hasError).toBe(true);
  });
});
