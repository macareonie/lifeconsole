import {
  createBoardService,
  deleteBoardByIdService,
  getAllBoardsService,
  getBoardContentByIdService,
  updateBoardByIdService,
  updateBoardLayoutByIdService,
} from "./board.service.js";

import type { NextFunction, Request, Response } from "express";
import type { User } from "@supabase/supabase-js";

export const createNewBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title } = req.body;
  const user = req.user as User;
  try {
    const result = await createBoardService(title, user.email!);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBoards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllBoardsService();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBoardContent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await getBoardContentByIdService(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateBoardLayout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { layout } = req.body;
  try {
    const result = await updateBoardLayoutByIdService(Number(id), layout);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const result = await updateBoardByIdService(Number(id), { title });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await deleteBoardByIdService(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
