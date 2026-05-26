import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/repositories/column.repository.js", () => ({
  addColumn: vi.fn(),
  getColumnById: vi.fn(),
  getAllColumns: vi.fn(),
  updateColumnById: vi.fn(),
  deleteColumnById: vi.fn(),
  getColumnsByBoardId: vi.fn(),
}));

import * as colService from "../../src/modules/columns/column.service.js";
import * as colRepo from "../../src/repositories/column.repository.js";
import { ServiceError } from "../../src/errors/service.error.js";

beforeEach(() => vi.clearAllMocks());

describe("column.service", () => {
  it("createColumn - success", async () => {
    (colRepo.addColumn as any).mockResolvedValue({
      data: {},
      error: null,
    });
    const res = await colService.createColumn("T", 1, 1);
    expect(res.success).toBe(true);
  });

  it("createColumn - invalid position throws", async () => {
    await expect(colService.createColumn("T", 1, -1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("getColumnById - not found throws", async () => {
    (colRepo.getColumnById as any).mockResolvedValue({
      data: null,
      error: null,
    });
    await expect(colService.getColumnById(5)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});
