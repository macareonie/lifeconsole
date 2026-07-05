import { beforeEach, describe, expect, it, vi } from "vitest";

import * as boardController from "../../src/modules/kanban/boards/board.controller.js";
import * as boardService from "../../src/modules/kanban/boards/board.service.js";

vi.mock("../../src/modules/kanban/boards/board.service.js", () => ({
  createBoardService: vi.fn(),
  getAllBoardsService: vi.fn(),
  getBoardContentByIdService: vi.fn(),
  updateBoardByIdService: vi.fn(),
  deleteBoardByIdService: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("board.controller", () => {
  it("createNewBoard calls service and returns 201", async () => {
    (boardService.createBoardService as any).mockResolvedValue({
      success: true,
    });
    const req = { body: { title: "New" }, user: { email: "u@u.com" } } as any;
    const res = makeRes();
    await boardController.createNewBoard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("getBoards calls service and returns 200", async () => {
    (boardService.getAllBoardsService as any).mockResolvedValue({
      data: [],
      success: true,
    });
    const req = {} as any;
    const res = makeRes();
    await boardController.getBoards(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getBoardContent calls service and returns 200", async () => {
    (boardService.getBoardContentByIdService as any).mockResolvedValue({
      data: { id: 1, columns: [] },
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await boardController.getBoardContent(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateBoard calls service and returns 200", async () => {
    (boardService.updateBoardByIdService as any).mockResolvedValue({
      success: true,
    });
    const req = { params: { id: "1" }, body: { title: "X" } } as any;
    const res = makeRes();
    await boardController.updateBoard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteBoard calls service and returns 200", async () => {
    (boardService.deleteBoardByIdService as any).mockResolvedValue({
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await boardController.deleteBoard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("createNewBoard forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.createBoardService as any).mockRejectedValue(error);
    const req = { body: { title: "New" }, user: { email: "u@u.com" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.createNewBoard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getBoards forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.getAllBoardsService as any).mockRejectedValue(error);
    const req = {} as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.getBoards(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getBoardContent forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.getBoardContentByIdService as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();
    await boardController.getBoardContent(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("updateBoard forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.updateBoardByIdService as any).mockRejectedValue(error);
    const req = { params: { id: "1" }, body: { title: "X" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.updateBoard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("deleteBoard forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.deleteBoardByIdService as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.deleteBoard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
