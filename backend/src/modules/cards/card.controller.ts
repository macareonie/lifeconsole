import { type NextFunction, type Request, type Response } from "express";
import {
  createCard,
  getAllCards,
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
    const { title, columnId, position, content } = req.body;
    const result = await createCard(title, columnId, position, content);
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

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllCards();
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
  const { title, columnId, position, content } = req.body;
  try {
    const result = await updateCardById(
      Number(id),
      title,
      position,
      columnId,
      content,
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
  const { boardId } = req.params;
  try {
    const result = await getAllCardsByBoardId(Number(boardId));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
