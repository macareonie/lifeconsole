import {
  createCardService,
  deleteCardByIdService,
  updateCardByIdService,
} from "./card.service.js";

import type { NextFunction, Request, Response } from "express";

export const createNewCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cardData = req.body;
    const result = await createCardService(cardData);
    res.status(201).json(result);
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
  const cardData = req.body;
  try {
    const result = await updateCardByIdService(Number(id), cardData);
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
    const result = await deleteCardByIdService(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
