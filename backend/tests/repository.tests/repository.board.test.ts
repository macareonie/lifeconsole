import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../../src/config/db.js";
import * as boardRepo from "../../src/repositories/board.repository.js";

vi.mock("../../src/config/db.js", () => ({ db: { from: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());

describe("board.repository", () => {
  it("getBoardById returns data", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    };
    (db.from as any).mockReturnValue(chain);
    const out = await boardRepo.getBoardById(1);
    expect(out.data).toBeDefined();
  });
});
