import { getUserIdByEmail } from "../../repositories/user.repository.js";
import {
  addBoard,
  getBoardById as getBoardByIdRepo,
  getAllBoards as getAllBoardsRepo,
  updateBoardById as updateBoardByIdRepo,
  deleteBoardById as deleteBoardByIdRepo,
} from "../../repositories/board.repository.js";

import { ServiceError } from "../../errors/service.error.js";

const boardNotFoundError = new ServiceError(
  "BoardServiceError",
  "Board not found! Time to create one!",
  404,
);

export const createBoard = async (title: string, email: string) => {
  if (!email) {
    throw new ServiceError(
      "BoardServiceError",
      "User must be authenticated to create a board",
      400,
    );
  }

  const { userId, hasError: userIdError } = await getUserIdByEmail(email);
  if (userIdError) {
    throw new ServiceError(
      "BoardServiceError",
      "Internal server error: Getting user ID",
      500,
    );
  }

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
  const { data, error } = await getAllBoardsRepo();
  if (error) {
    throw new ServiceError("BoardServiceError", error.message, 400);
  }
  if (!data || data.length === 0) {
    throw boardNotFoundError;
  }
  return {
    data: data,
    message: "Boards retrieved successfully",
    success: true,
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
