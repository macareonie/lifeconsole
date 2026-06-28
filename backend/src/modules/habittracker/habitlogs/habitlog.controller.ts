import {
  getLogsByDateRangeService,
  toggleHabitLogService,
} from "./habitlog.service.js";

import type { User } from "@supabase/supabase-js";
import type { Request, Response, NextFunction } from "express";

export const getHabitLogsByDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { startDate, endDate } = req.query;
  const user = req.user as User;
  try {
    const result = await getLogsByDateRangeService(
      user.email!,
      startDate as string,
      endDate as string,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleHabitLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { habitId, date } = req.body;
  try {
    const result = await toggleHabitLogService(Number(habitId), date as string);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
