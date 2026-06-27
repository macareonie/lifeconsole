import { beforeEach, describe, expect, it, vi } from "vitest";

import * as cardController from "../../src/modules/kanban/cards/card.controller.js";
import * as cardService from "../../src/modules/kanban/cards/card.service.js";

vi.mock("../../src/modules/kanban/cards/card.service.js", () => ({
  createCardService: vi.fn(),
  updateCardByIdService: vi.fn(),
  deleteCardByIdService: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("card.controller", () => {
  it("createNewCard calls service and returns 201", async () => {
    (cardService.createCardService as any).mockResolvedValue({ success: true });
    const req = {
      body: {
        title: "t",
        subtitle: "s",
        columnId: 1,
        position: 0,
        metadata: {},
      },
    } as any;
    const res = makeRes();
    await cardController.createNewCard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("updateCard calls service and returns 200", async () => {
    (cardService.updateCardByIdService as any).mockResolvedValue({
      success: true,
    });
    const req = { params: { id: "1" }, body: { title: "x" } } as any;
    const res = makeRes();
    await cardController.updateCard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteCard calls service and returns 200", async () => {
    (cardService.deleteCardByIdService as any).mockResolvedValue({
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await cardController.deleteCard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("createNewCard forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.createCardService as any).mockRejectedValue(error);
    const req = {
      body: {
        title: "t",
        subtitle: "s",
        columnId: 1,
        position: 0,
        metadata: {},
      },
    } as any;
    const res = makeRes();
    const next = vi.fn();

    await cardController.createNewCard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("updateCard forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.updateCardByIdService as any).mockRejectedValue(error);
    const req = { params: { id: "1" }, body: { title: "x" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await cardController.updateCard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("deleteCard forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.deleteCardByIdService as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await cardController.deleteCard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
