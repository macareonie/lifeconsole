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
  const { start_date, end_date } = req.query;
  const user = req.user as User;
  try {
    const result = await getLogsByDateRangeService(
      user.email!,
      start_date as string,
      end_date as string,
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
  const { habit_id, date } = req.body;
  try {
    const result = await toggleHabitLogService(
      Number(habit_id),
      date as string,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
