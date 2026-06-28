import { beforeEach, describe, expect, it, vi } from "vitest";

import { ServiceError } from "../../src/errors/service.error.js";
import * as cardService from "../../src/modules/kanban/cards/card.service.js";
import * as cardRepo from "../../src/repositories/kanban/card.repository.js";

vi.mock("../../src/repositories/kanban/card.repository.js", () => ({
  addCard: vi.fn(),
  updateCardById: vi.fn(),
  deleteCardById: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

describe("card.service", () => {
  it("createCard - success", async () => {
    (cardRepo.addCard as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await cardService.createCardService({
      title: "Test Card",
      subtitle: "Test Subtitle",
      columnId: 1,
      position: 1,
      metadata: {},
    });

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
      cardService.createCardService({
        title: "Test Card",
        subtitle: "Test Subtitle",
        columnId: 1,
        position: 1,
        metadata: {},
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createCard - invalid position throws", async () => {
    await expect(
      cardService.createCardService({
        title: "Test Card",
        subtitle: "Test Subtitle",
        columnId: 1,
        position: -5,
        metadata: {},
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("createCard - missing position throws", async () => {
    await expect(
      cardService.createCardService({
        title: "Test Card",
        subtitle: "Test Subtitle",
        columnId: 1,
        position: undefined as unknown as number,
        metadata: {},
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("updateCardById - success", async () => {
    (cardRepo.updateCardById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await cardService.updateCardByIdService(1, {
      title: "t",
      subtitle: "s",
      columnId: 1,
      position: 2,
      metadata: {},
    });

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
      cardService.updateCardByIdService(1, {
        title: "t",
        subtitle: "s",
        columnId: 1,
        position: 2,
        metadata: {},
      }),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it("deleteCardById - success", async () => {
    (cardRepo.deleteCardById as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await cardService.deleteCardByIdService(1);

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

    await expect(cardService.deleteCardByIdService(1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });
});
