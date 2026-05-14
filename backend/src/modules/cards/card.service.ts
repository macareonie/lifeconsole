import {
  addCard,
  getCardById as getCardByIdRepo,
  getAllCards as getAllCardsRepo,
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
  columnId: number,
  position: number,
  content: JsonValue,
) => {
  // same thing here, title should probably be optional but position should not
  if (!position || position < 0) {
    throw new ServiceError(
      "CardServiceError",
      "Position is required and must be a non-negative integer",
      400,
    );
  }
  const { data, error } = await addCard(title, columnId, position, content);
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

export const getAllCards = async () => {
  const { data, error } = await getAllCardsRepo();
  if (error) {
    throw new ServiceError("CardServiceError", error.message, 500);
  }
  if (!data || data.length === 0) {
    throw cardNotFoundError;
  }
  return {
    data: data,
    message: "Cards retrieved successfully",
    success: true,
  };
};

export const updateCardById = async (
  id: number,
  title: string,
  position: number,
  columnId: number,
  content: JsonValue,
) => {
  const { data: updatedData, error } = await updateCardByIdRepo(id, {
    title,
    columnId,
    position,
    content,
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

export const getAllCardsByBoardId = async (boardId: number) => {
  const { data, error } = await getCardsByBoardIdRepo(boardId);
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
    message: `Cards in board ${boardId} retrieved successfully`,
    success: true,
  };
};
