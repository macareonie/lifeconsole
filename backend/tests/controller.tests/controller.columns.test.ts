import { beforeEach, describe, expect, it, vi } from "vitest";

import * as colController from "../../src/modules/kanban/columns/column.controller.js";
import * as colService from "../../src/modules/kanban/columns/column.service.js";

vi.mock("../../src/modules/kanban/columns/column.service.js", () => ({
  createColumnService: vi.fn(),
  updateColumnByIdService: vi.fn(),
  deleteColumnByIdService: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("column.controller", () => {
  it("createNewColumn calls service and returns 201", async () => {
    (colService.createColumnService as any).mockResolvedValue({
      success: true,
    });
    const req = { body: { title: "t", boardId: 1, position: 0 } } as any;
    const res = makeRes();
    await colController.createNewColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("updateColumn calls service and returns 200", async () => {
    (colService.updateColumnByIdService as any).mockResolvedValue({
      success: true,
    });
    const req = {
      params: { id: "1" },
      body: { title: "x", position: 1 },
    } as any;
    const res = makeRes();
    await colController.updateColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteColumn calls service and returns 200", async () => {
    (colService.deleteColumnByIdService as any).mockResolvedValue({
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await colController.deleteColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("createNewColumn forwards errors to next", async () => {
    const error = new Error("boom");
    (colService.createColumnService as any).mockRejectedValue(error);
    const req = { body: { title: "t", boardId: 1, position: 0 } } as any;
    const res = makeRes();
    const next = vi.fn();

    await colController.createNewColumn(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("updateColumn forwards errors to next", async () => {
    const error = new Error("boom");
    (colService.updateColumnByIdService as any).mockRejectedValue(error);
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
    (colService.deleteColumnByIdService as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await colController.deleteColumn(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
