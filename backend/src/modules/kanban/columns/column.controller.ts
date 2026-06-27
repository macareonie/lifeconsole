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
  const { title, boardId, position } = req.body;
  try {
    const result = await createColumnService(title, boardId, position);
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
  const { title, position } = req.body;

  try {
    const result = await updateColumnByIdService(Number(id), title, position);
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
