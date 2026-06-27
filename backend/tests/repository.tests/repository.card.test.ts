import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../../src/config/db.js";
import * as cardRepo from "../../src/repositories/kanban/card.repository.js";

vi.mock("../../src/config/db.js", () => ({ db: { from: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());

describe("card.repository", () => {
  it("addCard returns data", async () => {
    const chain = {
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    };
    (db.from as any).mockReturnValue(chain);
    const out = await cardRepo.addCard("t", "s", 1, 0, {});
    expect(out.data).toBeDefined();
  });
});
