import { type NextFunction, type Request, type Response } from "express";
import {
  getColumnById,
  createColumn,
  updateColumnById,
  deleteColumnById,
  getAllColumnsByBoardId,
} from "./column.service.js";

export const createNewColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, board_id, position } = req.body;
  try {
    const result = await createColumn(title, board_id, position);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getColumn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await getColumnById(Number(id));
    res.status(200).json(result);
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
    const result = await updateColumnById(Number(id), title, position);
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
    const result = await deleteColumnById(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getColumnsByBoardId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { board_id } = req.params;
  try {
    const result = await getAllColumnsByBoardId(Number(board_id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
