import { ServiceError } from "../../../errors/service.error.js";
import {
  addBoard,
  deleteBoardById,
  getAllBoards,
  getBoardById,
  updateBoardById,
} from "../../../repositories/kanban/board.repository.js";
import {
  getCardsByBoardId,
  updateCardById,
} from "../../../repositories/kanban/card.repository.js";
import {
  getColumnsByBoardId,
  updateColumnById,
} from "../../../repositories/kanban/column.repository.js";
import { resolveUserId } from "../../../utils/email-to-userId.js";

import type {
  BoardSummary,
  BoardContent,
  Column,
  Card,
} from "../../../types/kanban.js";

export const createBoardService = async (title: string, email: string) => {
  const userId = await resolveUserId(email);
  if (!userId) {
    throw new ServiceError(
      "BoardServiceError",
      "NOT_FOUND",
      "User not found from email",
    );
  }

  if (!title) {
    throw new ServiceError(
      "BoardServiceError",
      "MISSING_REQUIRED_FIELD",
      "Title is required",
    );
  }

  const { error } = await addBoard(title, userId);
  if (error) {
    throw new ServiceError(
      "BoardServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }

  return {
    message: "Board created successfully",
    success: true,
  };
};

export const getAllBoardsService = async () => {
  let { data, error } = await getAllBoards();
  if (error) {
    throw new ServiceError(
      "BoardServiceError",
      "DATABASE_ERROR",
      error.message,
    );
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
      .filter((card) => card.columnId === column.id)
      .sort((a: Card, b: Card) => a.position - b.position),
  }));

  return {
    ...boardData,
    columns: columnsWithCards,
  } as BoardContent;
}

export const getBoardContentByIdService = async (id: number) => {
  const { data: boardData, error: boardError } = await getBoardById(id);
  const { data: columnsData, error: columnsError } =
    await getColumnsByBoardId(id);
  const { data: cardsData, error: cardsError } = await getCardsByBoardId(id);

  if (boardError) {
    throw new ServiceError(
      "BoardServiceError",
      "DATABASE_ERROR",
      boardError.message,
    );
  }
  if (columnsError) {
    throw new ServiceError(
      "BoardServiceError",
      "DATABASE_ERROR",
      columnsError.message,
    );
  }
  if (cardsError) {
    throw new ServiceError(
      "BoardServiceError",
      "DATABASE_ERROR",
      cardsError.message,
    );
  }

  if (!boardData) {
    throw new ServiceError(
      "BoardServiceError",
      "NOT_FOUND",
      "Board data not found",
    );
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
    cardIds: number[];
  }[];
};

export const updateBoardLayoutByIdService = async (
  id: number,
  layout: updateLayoutRequestBody,
) => {
  if (!layout || !Array.isArray(layout.columns)) {
    throw new ServiceError(
      "BoardServiceError",
      "VALIDATION_ERROR",
      "Invalid layout structure",
    );
  }

  for (const [columnPosition, column] of layout.columns.entries()) {
    if (typeof column.id !== "number" || !Array.isArray(column.cardIds)) {
      throw new ServiceError(
        "BoardServiceError",
        "VALIDATION_ERROR",
        "Invalid column structure",
      );
    }

    const { error: columnError } = await updateColumnById(column.id, {
      position: columnPosition,
    });

    if (columnError) {
      throw new ServiceError(
        "BoardServiceError",
        "DATABASE_ERROR",
        columnError.message,
      );
    }

    for (const [cardPosition, cardId] of column.cardIds.entries()) {
      const { error: cardError } = await updateCardById(cardId, {
        columnId: column.id,
        position: cardPosition,
      });

      if (cardError) {
        throw new ServiceError(
          "BoardServiceError",
          "DATABASE_ERROR",
          cardError.message,
        );
      }
    }
  }

  return {
    success: true,
    message: "Board layout updated successfully",
  };
};

export const updateBoardByIdService = async (
  id: number,
  updates: Partial<{ title: string }>,
) => {
  const { error } = await updateBoardById(id, updates);
  if (error) {
    throw new ServiceError(
      "BoardServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Board updated successfully",
    success: true,
  };
};

export const deleteBoardByIdService = async (id: number) => {
  const { error } = await deleteBoardById(id);
  if (error) {
    throw new ServiceError(
      "BoardServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Board deleted successfully",
    success: true,
  };
};
