import { beforeEach, describe, expect, it, vi } from "vitest";

import * as boardController from "../../src/modules/boards/board.controller.js";
import * as boardService from "../../src/modules/boards/board.service.js";

vi.mock("../../src/modules/boards/board.service.js", () => ({
  createBoard: vi.fn(),
  getBoardById: vi.fn(),
  getAllBoards: vi.fn(),
  getBoardContentById: vi.fn(),
  updateBoardById: vi.fn(),
  deleteBoardById: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("board.controller", () => {
  it("createNewBoard calls service and returns 201", async () => {
    (boardService.createBoard as any).mockResolvedValue({ success: true });
    const req = { body: { title: "New" }, user: { email: "u@u.com" } } as any;
    const res = makeRes();
    await boardController.createNewBoard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("getBoard calls service and returns 200", async () => {
    (boardService.getBoardById as any).mockResolvedValue({
      data: { id: 1 },
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await boardController.getBoard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getBoards calls service and returns 200", async () => {
    (boardService.getAllBoards as any).mockResolvedValue({
      data: [],
      success: true,
    });
    const req = {} as any;
    const res = makeRes();
    await boardController.getBoards(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getBoardContent calls service and returns 200", async () => {
    (boardService.getBoardContentById as any).mockResolvedValue({
      data: { id: 1, columns: [] },
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await boardController.getBoardContent(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateBoard calls service and returns 200", async () => {
    (boardService.updateBoardById as any).mockResolvedValue({ success: true });
    const req = { params: { id: "1" }, body: { title: "X" } } as any;
    const res = makeRes();
    await boardController.updateBoard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteBoard calls service and returns 200", async () => {
    (boardService.deleteBoardById as any).mockResolvedValue({ success: true });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await boardController.deleteBoard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("createNewBoard forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.createBoard as any).mockRejectedValue(error);
    const req = { body: { title: "New" }, user: { email: "u@u.com" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.createNewBoard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getBoard forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.getBoardById as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.getBoard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getBoards forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.getAllBoards as any).mockRejectedValue(error);
    const req = {} as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.getBoards(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getBoardContent forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.getBoardContentById as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();
    await boardController.getBoardContent(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("updateBoard forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.updateBoardById as any).mockRejectedValue(error);
    const req = { params: { id: "1" }, body: { title: "X" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.updateBoard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("deleteBoard forwards errors to next", async () => {
    const error = new Error("boom");
    (boardService.deleteBoardById as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await boardController.deleteBoard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
