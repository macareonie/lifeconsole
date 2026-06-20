import { beforeEach, describe, expect, it, vi } from "vitest";

import { ServiceError } from "../../src/errors/service.error.js";
import * as colService from "../../src/modules/columns/column.service.js";
import * as colRepo from "../../src/repositories/column.repository.js";

vi.mock("../../src/repositories/column.repository.js", () => ({
  addColumn: vi.fn(),
  getColumnById: vi.fn(),
  getAllColumns: vi.fn(),
  updateColumnById: vi.fn(),
  deleteColumnById: vi.fn(),
  getColumnsByBoardId: vi.fn(),
}));

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

  it("createColumn - repo error throws", async () => {
    (colRepo.addColumn as any).mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    });

    await expect(colService.createColumn("T", 1, 1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("createColumn - invalid position throws", async () => {
    await expect(colService.createColumn("T", 1, -1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("createColumn - missing position throws", async () => {
    await expect(
      colService.createColumn("T", 1, undefined as unknown as number),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("getColumnById - returns data", async () => {
    (colRepo.getColumnById as any).mockResolvedValue({
      data: { id: 1, title: "Todo", board_id: 1, position: 1 },
      error: null,
    });

    const result = await colService.getColumnById(1);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 1,
      title: "Todo",
      board_id: 1,
      position: 1,
    });
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

  it("getColumnById - repository error throws", async () => {
    (colRepo.getColumnById as any).mockResolvedValue({
      data: null,
      error: { message: "query failed" },
    });

    await expect(colService.getColumnById(1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("updateColumnById - success", async () => {
    (colRepo.updateColumnById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await colService.updateColumnById(1, "Done", 2);

    expect(result).toEqual({
      message: "Column updated successfully",
      success: true,
    });
  });

  it("updateColumnById - throws on repo error", async () => {
    (colRepo.updateColumnById as any).mockResolvedValue({
      data: null,
      error: { message: "err" },
    });
    await expect(colService.updateColumnById(1, "t", 0)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("updateColumnById - invalid negative position throws", async () => {
    await expect(
      colService.updateColumnById(1, "t", -1),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("deleteColumnById - success", async () => {
    (colRepo.deleteColumnById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await colService.deleteColumnById(1);

    expect(result).toEqual({
      message: "Column deleted successfully",
      success: true,
    });
  });

  it("deleteColumnById - repository error throws", async () => {
    (colRepo.deleteColumnById as any).mockResolvedValue({
      data: null,
      error: { message: "delete failed" },
    });

    await expect(colService.deleteColumnById(1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("getAllColumnsByBoardId - returns data", async () => {
    (colRepo.getColumnsByBoardId as any).mockResolvedValue({
      data: [{ id: 1 }],
      error: null,
    });
    const res = await colService.getAllColumnsByBoardId(1);
    expect(res.success).toBe(true);
  });

  it("getAllColumnsByBoardId - repository error throws", async () => {
    (colRepo.getColumnsByBoardId as any).mockResolvedValue({
      data: null,
      error: { message: "query failed" },
    });

    await expect(colService.getAllColumnsByBoardId(1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});
