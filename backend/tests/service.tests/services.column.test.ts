import { beforeEach, describe, expect, it, vi } from "vitest";

import { ServiceError } from "../../src/errors/service.error.js";
import * as colService from "../../src/modules/kanban/columns/column.service.js";
import * as colRepo from "../../src/repositories/kanban/column.repository.js";

vi.mock("../../src/repositories/kanban/column.repository.js", () => ({
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
    const res = await colService.createColumnService({
      title: "Test Column",
      position: 1,
      boardId: 1,
    });
    expect(res.success).toBe(true);
  });

  it("createColumn - repo error throws", async () => {
    (colRepo.addColumn as any).mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    });

    await expect(
      colService.createColumnService({
        title: "Test Column",
        position: 1,
        boardId: 1,
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createColumn - invalid position throws", async () => {
    await expect(
      colService.createColumnService({
        title: "Test Column",
        position: -1,
        boardId: 1,
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createColumn - missing position throws", async () => {
    await expect(
      colService.createColumnService({
        title: "Test Column",
        position: undefined as unknown as number,
        boardId: 1,
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("updateColumnById - success", async () => {
    (colRepo.updateColumnById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await colService.updateColumnByIdService(1, {
      title: "Done",
      position: 2,
    });

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
    await expect(
      colService.updateColumnByIdService(1, { title: "t", position: 0 }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("updateColumnById - invalid negative position throws", async () => {
    await expect(
      colService.updateColumnByIdService(1, { title: "t", position: -1 }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("deleteColumnById - success", async () => {
    (colRepo.deleteColumnById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await colService.deleteColumnByIdService(1);

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

    await expect(colService.deleteColumnByIdService(1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});
