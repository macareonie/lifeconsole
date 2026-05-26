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
});
