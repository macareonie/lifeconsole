import { type NextFunction, type Request, type Response } from "express";
import { type User } from "@supabase/supabase-js";
import {
  createBoard,
  getBoardById,
  getAllBoards,
  getBoardContentById,
  updateBoardById,
  updateBoardLayoutById,
  deleteBoardById,
} from "./board.service.js";

export const createNewBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title } = req.body;
  const user = req.user as User;
  try {
    const result = await createBoard(title, user.email!);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await getBoardById(Number(id));
    return res.status(200).json(result);
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
    const result = await getAllBoards();
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
    const result = await getBoardContentById(Number(id));
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
  const layout = req.body;
  try {
    const result = await updateBoardLayoutById(Number(id), layout);
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
    const result = await updateBoardById(Number(id), { title });
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
    const result = await deleteBoardById(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
