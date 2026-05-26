import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/repositories/card.repository.js", () => ({
  addCard: vi.fn(),
  getCardById: vi.fn(),
  updateCardById: vi.fn(),
  deleteCardById: vi.fn(),
  getCardsByBoardId: vi.fn(),
}));

import * as cardService from "../../src/modules/cards/card.service.js";
import * as cardRepo from "../../src/repositories/card.repository.js";
import { ServiceError } from "../../src/errors/service.error.js";

beforeEach(() => vi.clearAllMocks());

describe("card.service", () => {
  it("createCard - invalid position throws", async () => {
    await expect(
      cardService.createCard("t", "s", 1, -5, {}),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("getCardById - not found throws", async () => {
    (cardRepo.getCardById as any).mockResolvedValue({
      data: null,
      error: null,
    });
    await expect(cardService.getCardById(10)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});
