import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/modules/columns/column.service.js", () => ({
  createColumn: vi.fn(),
  getColumnById: vi.fn(),
  getAllColumns: vi.fn(),
  updateColumnById: vi.fn(),
  deleteColumnById: vi.fn(),
  getAllColumnsByBoardId: vi.fn(),
}));

import * as colController from "../../src/modules/columns/column.controller.js";
import * as colService from "../../src/modules/columns/column.service.js";

beforeEach(() => vi.clearAllMocks());

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("column.controller", () => {
  it("createNewColumn calls service and returns 201", async () => {
    (colService.createColumn as any).mockResolvedValue({ success: true });
    const req = { body: { title: "t", boardId: 1, position: 0 } } as any;
    const res = makeRes();
    await colController.createNewColumn(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
