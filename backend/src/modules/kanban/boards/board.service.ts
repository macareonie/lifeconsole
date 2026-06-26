import { ServiceError } from "../../../errors/service.error.js";
import {
  addBoard,
  deleteBoardById as deleteBoardByIdRepo,
  getAllBoards as getAllBoardsRepo,
  getBoardById as getBoardByIdRepo,
  updateBoardById as updateBoardByIdRepo,
} from "../../../repositories/board.repository.js";
import {
  getCardsByBoardId,
  updateCardById,
} from "../../../repositories/card.repository.js";
import {
  getColumnsByBoardId,
  updateColumnById,
} from "../../../repositories/column.repository.js";
import { resolveUserId } from "../../../utils/email2userid.js";

import type {
  BoardSummary,
  BoardContent,
  Column,
  Card,
} from "../../../types/kanban.js";
const boardNotFoundError = new ServiceError(
  "BoardServiceError",
  "Board not found! Time to create one!",
  404,
);

export const createBoard = async (title: string, email: string) => {
  const userId = await resolveUserId(email);
  if (!userId) {
    throw new ServiceError("BoardServiceError", "User not found", 404);
  }

  if (!title) {
    throw new ServiceError("BoardServiceError", "Title is required", 400);
  }

  const { data, error } = await addBoard(title, userId);
  if (error) {
    throw new ServiceError("BoardServiceError", error.message, 400);
  }

  return {
    message: "Board created successfully",
    success: true,
  };
};

export const getBoardById = async (id: number) => {
  const { data, error } = await getBoardByIdRepo(id);
  if (error) {
    throw new ServiceError("BoardServiceError", error.message, 400);
  }
  if (!data) {
    throw boardNotFoundError;
  }
  return {
    data: data,
    message: "Board retrieved successfully",
    success: true,
  };
};

export const getAllBoards = async () => {
  let { data, error } = await getAllBoardsRepo();
  if (error) {
    throw new ServiceError("BoardServiceError", error.message, 400);
  }

  if (!data || data.length === 0) {
    data = [];
  }
  return {
    data: data,
    message: "Boards retrieved successfully",
    success: true,
  };
};

function buildBoardContent(
  boardData: BoardSummary,
  columnsData: Column[],
  cardsData: Card[],
) {
  const columnsWithCards: Column[] = columnsData.map((column: Column) => ({
    ...column,
    cards: cardsData
      .filter((card: Card) => card.column_id === column.id)
      .sort((a: Card, b: Card) => a.position - b.position),
  }));

  return {
    ...boardData,
    columns: columnsWithCards,
  } as BoardContent;
}

export const getBoardContentById = async (id: number) => {
  const { data: boardData, error: boardError } = await getBoardByIdRepo(id);
  const { data: columnsData, error: columnsError } =
    await getColumnsByBoardId(id);
  const { data: cardsData, error: cardsError } = await getCardsByBoardId(id);

  if (boardError) {
    throw new ServiceError("BoardServiceError", boardError.message, 400);
  }
  if (columnsError) {
    throw new ServiceError("BoardServiceError", columnsError.message, 400);
  }
  if (cardsError) {
    throw new ServiceError("BoardServiceError", cardsError.message, 400);
  }

  if (!boardData) {
    throw boardNotFoundError;
  }

  const boardContent = buildBoardContent(
    boardData,
    columnsData || [],
    cardsData || [],
  );

  return {
    data: boardContent,
    message: "Board content retrieved successfully",
    success: true,
  };
};

type updateLayoutRequestBody = {
  columns: {
    id: number;
    card_ids: number[];
  }[];
};

export const updateBoardLayoutById = async (
  id: number,
  layout: updateLayoutRequestBody,
) => {
  if (!layout || !Array.isArray(layout.columns)) {
    throw new ServiceError(
      "BoardServiceError",
      "Invalid layout structure",
      400,
    );
  }

  for (const [columnPosition, column] of layout.columns.entries()) {
    if (typeof column.id !== "number" || !Array.isArray(column.card_ids)) {
      throw new ServiceError(
        "BoardServiceError",
        "Invalid column structure",
        400,
      );
    }

    const { error: columnError } = await updateColumnById(column.id, {
      position: columnPosition,
    });

    if (columnError) {
      throw new ServiceError("BoardServiceError", columnError.message, 400);
    }

    for (const [cardPosition, cardId] of column.card_ids.entries()) {
      const { error: cardError } = await updateCardById(cardId, {
        column_id: column.id,
        position: cardPosition,
      });

      if (cardError) {
        throw new ServiceError("BoardServiceError", cardError.message, 400);
      }
    }
  }

  return {
    success: true,
    message: "Board layout updated successfully",
  };
};

export const updateBoardById = async (
  id: number,
  updates: Partial<{ title: string }>,
) => {
  const { data, error } = await updateBoardByIdRepo(id, updates);
  if (error) {
    throw new ServiceError("BoardServiceError", error.message, 400);
  }
  return {
    message: "Board updated successfully",
    success: true,
  };
};

export const deleteBoardById = async (id: number) => {
  const { data, error } = await deleteBoardByIdRepo(id);
  if (error) {
    throw new ServiceError("BoardServiceError", error.message, 400);
  }
  return {
    message: "Board deleted successfully",
    success: true,
  };
};
