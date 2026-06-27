import { ServiceError } from "../../../errors/service.error.js";
import {
  addColumn,
  deleteColumnById,
  updateColumnById,
} from "../../../repositories/kanban/column.repository.js";

export const createColumnService = async (
  title: string,
  boardId: number,
  position: number,
) => {
  if (position === undefined || position < 0) {
    throw new ServiceError(
      "ColumnServiceError",
      "Position is required and must be a non-negative integer",
      400,
    );
  }
  const { data, error } = await addColumn(title, boardId, position);
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  return {
    message: "Column created successfully",
    success: true,
  };
};

export const updateColumnByIdService = async (
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

  const { data, error } = await updateColumnById(id, { title, position });
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  return {
    message: "Column updated successfully",
    success: true,
  };
};

export const deleteColumnByIdService = async (id: number) => {
  const { data, error } = await deleteColumnById(id);
  if (error) {
    throw new ServiceError("ColumnServiceError", error.message, 400);
  }
  return {
    message: "Column deleted successfully",
    success: true,
  };
};
