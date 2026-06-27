import { ServiceError } from "../../../errors/service.error.js";
import {
  addCard,
  deleteCardById,
  updateCardById,
} from "../../../repositories/kanban/card.repository.js";

import type { JsonValue } from "../../../types/json.js";

export const createCardService = async (
  title: string,
  subtitle: string,
  columnId: number,
  position: number,
  metadata: JsonValue,
) => {
  if (position === undefined || position < 0) {
    throw new ServiceError(
      "CardServiceError",
      "Position is required and must be a non-negative integer",
      400,
    );
  }
  const { data, error } = await addCard(
    title,
    subtitle,
    columnId,
    position,
    metadata,
  );
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
  title: string,
  subtitle: string,
  position: number,
  columnId: number,
  metadata: JsonValue,
) => {
  const { data: updatedData, error } = await updateCardById(id, {
    title,
    subtitle,
    column_id: columnId,
    position,
    metadata,
  });
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 400);
  }
  return {
    message: "Card updated successfully",
    success: true,
  };
};

export const deleteCardByIdService = async (id: number) => {
  const { data, error } = await deleteCardById(id);
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 400);
  }
  return {
    message: "Card deleted successfully",
    success: true,
  };
};
