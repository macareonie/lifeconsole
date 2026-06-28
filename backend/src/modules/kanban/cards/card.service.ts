import { ServiceError } from "../../../errors/service.error.js";
import {
  addCard,
  deleteCardById,
  updateCardById,
} from "../../../repositories/kanban/card.repository.js";

import type { JsonValue } from "../../../types/json.js";
import type { CardUpdate } from "../../../types/kanban.js";

export const createCardService = async (cardData: CardUpdate) => {
  const { title, subtitle, columnId, position, metadata } = cardData;
  if (position === undefined || position < 0) {
    throw new ServiceError(
      "CardServiceError",
      "Position is required and must be a non-negative integer",
      400,
    );
  }
  const { error } = await addCard(cardData);
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 400);
  }
  return {
    message: "Card created successfully",
    success: true,
  };
};

export const updateCardByIdService = async (
  id: number,
  cardData: Partial<CardUpdate>,
) => {
  const { error } = await updateCardById(id, cardData);
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 400);
  }
  return {
    message: "Card updated successfully",
    success: true,
  };
};

export const deleteCardByIdService = async (id: number) => {
  const { error } = await deleteCardById(id);
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 400);
  }
  return {
    message: "Card deleted successfully",
    success: true,
  };
};
