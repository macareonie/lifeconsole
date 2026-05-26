import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/repositories/board.repository.js", () => ({
  getBoardById: vi.fn(),
  getAllBoards: vi.fn(),
}));

import { getBoardById } from "../../src/modules/boards/board.service.js";
import * as boardRepo from "../../src/repositories/board.repository.js";
import { ServiceError } from "../../src/errors/service.error.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("board.service", () => {
  it("getBoardById - returns data when repo returns row", async () => {
    (boardRepo.getBoardById as any).mockResolvedValue({
      data: { id: 1, title: "My" },
      error: null,
    });

    const res = await getBoardById(1);
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
  });

  it("getBoardById - throws ServiceError when not found", async () => {
    (boardRepo.getBoardById as any).mockResolvedValue({
      data: null,
      error: null,
    });

    await expect(getBoardById(999)).rejects.toBeInstanceOf(ServiceError);
  });
});
