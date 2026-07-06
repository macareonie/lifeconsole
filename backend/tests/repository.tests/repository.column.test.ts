import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../../src/config/db.js";
import * as colRepo from "../../src/repositories/kanban/column.repository.js";

vi.mock("../../src/config/db.js", () => ({ db: { from: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());

describe("column.repository", () => {
  it("addColumn returns no error", async () => {
    const chain = {
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    };
    (db.from as any).mockReturnValue(chain);
    const out = await colRepo.addColumn({
      title: "Test Column",
      position: 1,
      boardId: 1,
    });
    expect(out.error).toBeNull();
  });
});
