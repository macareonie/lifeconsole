import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../../src/config/db.js";
import * as cardRepo from "../../src/repositories/kanban/card.repository.js";

vi.mock("../../src/config/db.js", () => ({ db: { from: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());

describe("card.repository", () => {
  it("addCard returns no error", async () => {
    const chain = {
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    };
    (db.from as any).mockReturnValue(chain);
    const out = await cardRepo.addCard({
      title: "Test Card",
      subtitle: "Test Subtitle",
      columnId: 1,
      position: 0,
      metadata: {},
    });
    expect(out.error).toBeNull();
  });
});
