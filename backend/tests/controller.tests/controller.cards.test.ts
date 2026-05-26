import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/modules/cards/card.service.js", () => ({
  createCard: vi.fn(),
  getCardById: vi.fn(),
  updateCardById: vi.fn(),
  deleteCardById: vi.fn(),
  getAllCardsByBoardId: vi.fn(),
}));

import * as cardController from "../../src/modules/cards/card.controller.js";
import * as cardService from "../../src/modules/cards/card.service.js";

beforeEach(() => vi.clearAllMocks());

const makeRes = () => {
  const json = vi.fn();
  return { status: vi.fn(() => ({ json })), json } as any;
};

describe("card.controller", () => {
  it("createNewCard calls service and returns 201", async () => {
    (cardService.createCard as any).mockResolvedValue({ success: true });
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

  it("getCard calls service and returns 200", async () => {
    (cardService.getCardById as any).mockResolvedValue({
      data: { id: 1 },
      success: true,
    });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await cardController.getCard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateCard calls service and returns 200", async () => {
    (cardService.updateCardById as any).mockResolvedValue({ success: true });
    const req = { params: { id: "1" }, body: { title: "x" } } as any;
    const res = makeRes();
    await cardController.updateCard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteCard calls service and returns 200", async () => {
    (cardService.deleteCardById as any).mockResolvedValue({ success: true });
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    await cardController.deleteCard(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getCardsByBoardId calls service and returns 200", async () => {
    (cardService.getAllCardsByBoardId as any).mockResolvedValue({
      data: [],
      success: true,
    });
    const req = { params: { boardId: "1" } } as any;
    const res = makeRes();
    await cardController.getCardsByBoardId(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("createNewCard forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.createCard as any).mockRejectedValue(error);
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

  it("getCard forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.getCardById as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await cardController.getCard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("updateCard forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.updateCardById as any).mockRejectedValue(error);
    const req = { params: { id: "1" }, body: { title: "x" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await cardController.updateCard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("deleteCard forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.deleteCardById as any).mockRejectedValue(error);
    const req = { params: { id: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await cardController.deleteCard(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("getCardsByBoardId forwards errors to next", async () => {
    const error = new Error("boom");
    (cardService.getAllCardsByBoardId as any).mockRejectedValue(error);
    const req = { params: { boardId: "1" } } as any;
    const res = makeRes();
    const next = vi.fn();

    await cardController.getCardsByBoardId(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
