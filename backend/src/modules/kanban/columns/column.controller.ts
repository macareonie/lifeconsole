import type { ColumnUpdate } from "../../../types/kanban.js";
import {
  createColumnService,
  deleteColumnByIdService,
  updateColumnByIdService,
} from "./column.service.js";

import type { NextFunction, Request, Response } from "express";

export const createNewColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const columnData = req.body;
  try {
    const result = await createColumnService(columnData as ColumnUpdate);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const columnData = req.body;

  try {
    const result = await updateColumnByIdService(
      Number(id),
      columnData as ColumnUpdate,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await deleteColumnByIdService(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
