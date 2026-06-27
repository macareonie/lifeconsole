import { beforeEach, describe, expect, it, vi } from "vitest";

import { ServiceError } from "../../src/errors/service.error.js";
import * as cardService from "../../src/modules/kanban/cards/card.service.js";
import * as cardRepo from "../../src/repositories/kanban/card.repository.js";

vi.mock("../../src/repositories/kanban/card.repository.js", () => ({
  addCard: vi.fn(),
  getCardById: vi.fn(),
  updateCardById: vi.fn(),
  deleteCardById: vi.fn(),
  getCardsByBoardId: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

describe("card.service", () => {
  it("createCard - success", async () => {
    (cardRepo.addCard as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await cardService.createCard("t", "s", 1, 1, {});

    expect(result).toEqual({
      message: "Card created successfully",
      success: true,
    });
  });

  it("createCard - repo error throws", async () => {
    (cardRepo.addCard as any).mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    });

    await expect(
      cardService.createCard("t", "s", 1, 1, {}),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createCard - invalid position throws", async () => {
    await expect(
      cardService.createCard("t", "s", 1, -5, {}),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createCard - missing position throws", async () => {
    await expect(
      cardService.createCard("t", "s", 1, undefined as unknown as number, {}),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("getCardById - returns row", async () => {
    (cardRepo.getCardById as any).mockResolvedValue({
      data: { id: 1, title: "A" },
      error: null,
    });

    const result = await cardService.getCardById(1);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 1, title: "A" });
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

  it("getCardById - repo error throws", async () => {
    (cardRepo.getCardById as any).mockResolvedValue({
      data: null,
      error: { message: "query failed" },
    });

    await expect(cardService.getCardById(10)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("updateCardById - success", async () => {
    (cardRepo.updateCardById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await cardService.updateCardById(1, "t", "s", 1, 2, {});

    expect(result).toEqual({
      message: "Card updated successfully",
      success: true,
    });
  });

  it("updateCardById - throws on repo error", async () => {
    (cardRepo.updateCardById as any).mockResolvedValue({
      data: null,
      error: { message: "err" },
    });
    await expect(
      cardService.updateCardById(1, "t", "s", 0, 1, {}),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("deleteCardById - success", async () => {
    (cardRepo.deleteCardById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await cardService.deleteCardById(1);

    expect(result).toEqual({
      message: "Card deleted successfully",
      success: true,
    });
  });

  it("deleteCardById - repo error throws", async () => {
    (cardRepo.deleteCardById as any).mockResolvedValue({
      data: null,
      error: { message: "delete failed" },
    });

    await expect(cardService.deleteCardById(1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("getAllCardsByBoardId - returns truncated data", async () => {
    (cardRepo.getCardsByBoardId as any).mockResolvedValue({
      data: [{ id: 1, columns: { foo: "bar" } }],
      error: null,
    });
    const res = await cardService.getAllCardsByBoardId(1);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it("getAllCardsByBoardId - repo error throws", async () => {
    (cardRepo.getCardsByBoardId as any).mockResolvedValue({
      data: null,
      error: { message: "query failed" },
    });

    await expect(cardService.getAllCardsByBoardId(1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});
