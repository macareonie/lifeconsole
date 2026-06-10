import {
  addColumn,
  getColumnById as getColumnByIdRepo,
  updateColumnById as updateColumnByIdRepo,
  deleteColumnById as deleteColumnByIdRepo,
  getColumnsByBoardId as getColumnsByBoardIdRepo,
} from "../../repositories/column.repository.js";

import { ServiceError } from "../../errors/service.error.js";

const columnNotFoundError = new ServiceError(
  "ColumnServiceError",
  "Column not found! Time to create one!",
  404,
);

export const createColumn = async (
  title: string,
  board_id: number,
  position: number,
) => {
  //title should probably be optional here? position should not though
  if (position === undefined || position < 0) {
    throw new ServiceError(
      "ColumnServiceError",
      "Position is required and must be a non-negative integer",
      400,
    );
  }
  const { data, error } = await addColumn(title, board_id, position);
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  return {
    message: "Column created successfully",
    success: true,
  };
};

export const getColumnById = async (id: number) => {
  const { data, error } = await getColumnByIdRepo(id);
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  if (!data) {
    throw columnNotFoundError;
  }
  return {
    data: data,
    message: "Column retrieved successfully",
    success: true,
  };
};

export const updateColumnById = async (
  id: number,
  title: string,
  position: number,
) => {
  if (position === undefined || position < 0) {
    throw new ServiceError(
      "ColumnServiceError",
      "Position must be a non-negative integer",
      400,
    );
  }

  const { data, error } = await updateColumnByIdRepo(id, { title, position });
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  return {
    message: "Column updated successfully",
    success: true,
  };
};

export const deleteColumnById = async (id: number) => {
  const { data, error } = await deleteColumnByIdRepo(id);
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  return {
    message: "Column deleted successfully",
    success: true,
  };
};

export const getAllColumnsByBoardId = async (board_id: number) => {
  const { data, error } = await getColumnsByBoardIdRepo(board_id);
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  return {
    data: data,
    message: `Columns in board ${board_id} retrieved successfully`,
    success: true,
  };
};
