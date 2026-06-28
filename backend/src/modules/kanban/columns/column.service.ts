import { ServiceError } from "../../../errors/service.error.js";
import {
  addColumn,
  deleteColumnById,
  updateColumnById,
} from "../../../repositories/kanban/column.repository.js";

import type { ColumnUpdate } from "../../../types/kanban.js";

export const createColumnService = async (columnData: ColumnUpdate) => {
  const { title, boardId, position } = columnData;
  if (position === undefined || position < 0) {
    throw new ServiceError(
      "ColumnServiceError",
      "VALIDATION_ERROR",
      "Position is required and must be a non-negative integer",
    );
  }
  const { error } = await addColumn(columnData);
  if (error) {
    throw new ServiceError(
      "ColumnServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Column created successfully",
    success: true,
  };
};

export const updateColumnByIdService = async (
  id: number,
  columnData: ColumnUpdate,
) => {
  const { title, position } = columnData;
  if (position === undefined || position < 0) {
    throw new ServiceError(
      "ColumnServiceError",
      "VALIDATION_ERROR",
      "Position  is required and must be a non-negative integer",
    );
  }

  const { error } = await updateColumnById(id, columnData);
  if (error) {
    throw new ServiceError(
      "ColumnServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Column updated successfully",
    success: true,
  };
};

export const deleteColumnByIdService = async (id: number) => {
  const { error } = await deleteColumnById(id);
  if (error) {
    throw new ServiceError(
      "ColumnServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Column deleted successfully",
    success: true,
  };
};
