import { type NextFunction, type Request, type Response } from "express";
import {
  createCard,
  getCardById,
  updateCardById,
  deleteCardById,
  getAllCardsByBoardId,
} from "./card.service.js";

export const createNewCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, subtitle, column_id, position, metadata } = req.body;
    const result = await createCard(
      title,
      subtitle,
      column_id,
      position,
      metadata,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await getCardById(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { title, subtitle, column_id, position, metadata } = req.body;
  try {
    const result = await updateCardById(
      Number(id),
      title,
      subtitle,
      position,
      column_id,
      metadata,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await deleteCardById(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCardsByBoardId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { board_id } = req.params;
  try {
    const result = await getAllCardsByBoardId(Number(board_id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
