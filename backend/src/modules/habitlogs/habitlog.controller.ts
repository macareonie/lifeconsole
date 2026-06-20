import {
  addHabitLogService,
  deleteHabitLogByIdService,
  getAllLogsByHabitIdService,
  getHabitLogByIdService,
  updateHabitLogByIdService,
} from "./habitlog.service.js";

import type { Request, Response, NextFunction } from "express";
import type { HabitLog } from "../../types/habittracker.js";

export const addHabitLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = req.body;
  try {
    const result = await addHabitLogService(data as HabitLog);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getHabitLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await getHabitLogByIdService(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllLogsByHabitId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { habit_id } = req.params;
  try {
    const result = await getAllLogsByHabitIdService(Number(habit_id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateHabitLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const result = await updateHabitLogByIdService(
      Number(id),
      data as HabitLog,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteHabitLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await deleteHabitLogByIdService(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
