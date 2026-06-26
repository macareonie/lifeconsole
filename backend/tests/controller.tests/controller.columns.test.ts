import { beforeEach, describe, expect, it, vi } from "vitest";

import * as colController from "../../src/modules/kanban/columns/column.controller.js";
import * as colService from "../../src/modules/kanban/columns/column.service.js";

vi.mock("../../src/modules/kanban/columns/column.service.js", () => ({
  createColumn: vi.fn(),
  getColumnById: vi.fn(),
  getAllColumns: vi.fn(),
  updateColumnById: vi.fn(),
  deleteColumnById: vi.fn(),
  getAllColumnsByBoardId: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("column.controller", () => {
  it("createNewColumn calls service and returns 201", async () => {
    (colService.createColumn as any).mockResolvedValue({ success: true });
    const req = { body: { title: "t", board_id: 1, position: 0 } } as any;
    const res = makeRes();
    await colController.createNewColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("getColumn calls service and returns 200", async () => {
    (colService.getColumnById as any).mockResolvedValue({
      data: { id: 1 },
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await colController.getColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateColumn calls service and returns 200", async () => {
    (colService.updateColumnById as any).mockResolvedValue({ success: true });
    const req = {
      params: { id: "1" },
      body: { title: "x", position: 1 },
    } as any;
    const res = makeRes();
    await colController.updateColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteColumn calls service and returns 200", async () => {
    (colService.deleteColumnById as any).mockResolvedValue({ success: true });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await colController.deleteColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getColumnsByBoardId calls service and returns 200", async () => {
    (colService.getAllColumnsByBoardId as any).mockResolvedValue({
      data: [],
      success: true,
    });
    const req = { params: { board_id: "1" } } as any;
    const res = makeRes();
    await colController.getColumnsByBoardId(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("createNewColumn forwards errors to next", async () => {
    const error = new Error("boom");
    (colService.createColumn as any).mockRejectedValue(error);
    const req = { body: { title: "t", board_id: 1, position: 0 } } as any;
    const res = makeRes();
    const next = vi.fn();

    await colController.createNewColumn(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getColumn forwards errors to next", async () => {
    const error = new Error("boom");
    (colService.getColumnById as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await colController.getColumn(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("updateColumn forwards errors to next", async () => {
    const error = new Error("boom");
    (colService.updateColumnById as any).mockRejectedValue(error);
    const req = {
      params: { id: "1" },
      body: { title: "x", position: 1 },
    } as any;
    const res = makeRes();
    const next = vi.fn();

    await colController.updateColumn(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("deleteColumn forwards errors to next", async () => {
    const error = new Error("boom");
    (colService.deleteColumnById as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await colController.deleteColumn(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getColumnsByBoardId forwards errors to next", async () => {
    const error = new Error("boom");
    (colService.getAllColumnsByBoardId as any).mockRejectedValue(error);
    const req = { params: { board_id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await colController.getColumnsByBoardId(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
