import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/repositories/board.repository.js", () => ({
  addBoard: vi.fn(),
  getBoardById: vi.fn(),
  getAllBoards: vi.fn(),
  updateBoardById: vi.fn(),
  deleteBoardById: vi.fn(),
}));

vi.mock("../../src/repositories/user.repository.js", () => ({
  getUserIdByEmail: vi.fn(),
}));

import {
  createBoard,
  getBoardById,
  getAllBoards,
  updateBoardById,
  deleteBoardById,
} from "../../src/modules/boards/board.service.js";
import * as boardRepo from "../../src/repositories/board.repository.js";
import * as userRepo from "../../src/repositories/user.repository.js";
import { ServiceError } from "../../src/errors/service.error.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("board.service", () => {
  it("createBoard - success", async () => {
    (userRepo.getUserIdByEmail as any).mockResolvedValue({
      userId: 11,
      hasError: false,
    });
    (boardRepo.addBoard as any).mockResolvedValue({ data: {}, error: null });

    const result = await createBoard("Roadmap", "user@example.com");

    expect(result).toEqual({
      message: "Board created successfully",
      success: true,
    });
    expect(userRepo.getUserIdByEmail).toHaveBeenCalledWith("user@example.com");
    expect(boardRepo.addBoard).toHaveBeenCalledWith("Roadmap", 11);
  });

  it("createBoard - throws when email is missing", async () => {
    await expect(createBoard("Roadmap", "")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("createBoard - throws when user lookup fails", async () => {
    (userRepo.getUserIdByEmail as any).mockResolvedValue({
      userId: null,
      hasError: true,
    });

    await expect(
      createBoard("Roadmap", "user@example.com"),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createBoard - throws when user is missing", async () => {
    (userRepo.getUserIdByEmail as any).mockResolvedValue({
      userId: null,
      hasError: false,
    });

    await expect(
      createBoard("Roadmap", "user@example.com"),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createBoard - throws when title is missing", async () => {
    (userRepo.getUserIdByEmail as any).mockResolvedValue({
      userId: 11,
      hasError: false,
    });

    await expect(createBoard("", "user@example.com")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("createBoard - throws on repository insert error", async () => {
    (userRepo.getUserIdByEmail as any).mockResolvedValue({
      userId: 11,
      hasError: false,
    });
    (boardRepo.addBoard as any).mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    });

    await expect(
      createBoard("Roadmap", "user@example.com"),
    ).rejects.toBeInstanceOf(ServiceError);
  });

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

  it("getBoardById - throws ServiceError when repository errors", async () => {
    (boardRepo.getBoardById as any).mockResolvedValue({
      data: null,
      error: { message: "query failed" },
    });

    await expect(getBoardById(1)).rejects.toBeInstanceOf(ServiceError);
  });

  it("getAllBoards - returns empty array when none", async () => {
    (boardRepo.getAllBoards as any).mockResolvedValue({
      data: [],
      error: null,
    });

    const { data, success } = await getAllBoards();

    expect(success).toBe(true);
    expect(Array.isArray(data)).toBe(true);
  });

  it("getAllBoards - returns rows when repository has data", async () => {
    (boardRepo.getAllBoards as any).mockResolvedValue({
      data: [{ id: 1, title: "A" }],
      error: null,
    });

    const result = await getAllBoards();

    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ id: 1, title: "A" }]);
  });

  it("getAllBoards - throws when repository errors", async () => {
    (boardRepo.getAllBoards as any).mockResolvedValue({
      data: null,
      error: { message: "query failed" },
    });

    await expect(getAllBoards()).rejects.toBeInstanceOf(ServiceError);
  });

  it("updateBoardById - success", async () => {
    (boardRepo.updateBoardById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await updateBoardById(1, { title: "Updated" });

    expect(result).toEqual({
      message: "Board updated successfully",
      success: true,
    });
  });

  it("updateBoardById - throws when repo errors", async () => {
    (boardRepo.updateBoardById as any).mockResolvedValue({
      data: null,
      error: { message: "err" },
    });

    await expect(updateBoardById(1, { title: "x" })).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("deleteBoardById - success", async () => {
    (boardRepo.deleteBoardById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await deleteBoardById(1);

    expect(result).toEqual({
      message: "Board deleted successfully",
      success: true,
    });
  });

  it("deleteBoardById - throws when repo errors", async () => {
    (boardRepo.deleteBoardById as any).mockResolvedValue({
      data: null,
      error: { message: "err" },
    });

    await expect(deleteBoardById(1)).rejects.toBeInstanceOf(ServiceError);
  });
});
