import {
  addCard,
  getCardById as getCardByIdRepo,
  updateCardById as updateCardByIdRepo,
  deleteCardById as deleteCardByIdRepo,
  getCardsByBoardId as getCardsByBoardIdRepo,
} from "../../repositories/card.repository.js";

import type { JsonValue } from "../../types/json.js";
import { ServiceError } from "../../errors/service.error.js";

const cardNotFoundError = new ServiceError(
  "CardServiceError",
  "Card not found! Time to create one!",
  404,
);

export const createCard = async (
  title: string,
  subtitle: string,
  column_id: number,
  position: number,
  metadata: JsonValue,
) => {
  // same thing here, title should probably be optional but position should not
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
    column_id,
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

export const getCardById = async (id: number) => {
  const { data, error } = await getCardByIdRepo(id);
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 404);
  }
  if (!data) {
    throw cardNotFoundError;
  }
  return {
    data: data,
    message: "Card retrieved successfully",
    success: true,
  };
};

export const updateCardById = async (
  id: number,
  title: string,
  subtitle: string,
  position: number,
  column_id: number,
  metadata: JsonValue,
) => {
  const { data: updatedData, error } = await updateCardByIdRepo(id, {
    title,
    subtitle,
    column_id,
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

export const deleteCardById = async (id: number) => {
  const { data, error } = await deleteCardByIdRepo(id);
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 400);
  }
  return {
    message: "Card deleted successfully",
    success: true,
  };
};

export const getAllCardsByBoardId = async (board_id: number) => {
  const { data, error } = await getCardsByBoardIdRepo(board_id);
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 400);
  }

  // additional column data can be removed
  const truncatedData = data!.map((card) => {
    const { columns, ...rest } = card;
    return { ...rest };
  });

  return {
    data: truncatedData,
    message: `Cards in board ${board_id} retrieved successfully`,
    success: true,
  };
};
