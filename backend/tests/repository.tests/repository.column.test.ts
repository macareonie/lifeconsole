import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../../src/config/db.js";
import * as colRepo from "../../src/repositories/column.repository.js";

vi.mock("../../src/config/db.js", () => ({ db: { from: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());

describe("column.repository", () => {
  it("addColumn returns data", async () => {
    const chain = {
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    };
    (db.from as any).mockReturnValue(chain);
    const out = await colRepo.addColumn("Test Column", 1, 1);
    expect(out.data).toBeDefined();
  });
});
