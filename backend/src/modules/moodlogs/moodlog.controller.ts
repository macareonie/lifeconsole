import {
  deleteMoodLogByIdService,
  getMoodLogByDateService,
  setMoodLogService,
} from "./moodlog.service.js";

import type { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";

// export const getMoodLog = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { id } = req.params;
//     const result = await getMoodLogByIdService(Number(id));
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

export const getMoodLogByDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as User;
    const { date } = req.params;
    const result = await getMoodLogByDateService(user.email!, date as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteMoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await deleteMoodLogByIdService(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const setMoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as User;
    const { date, mood } = req.body;
    const result = await setMoodLogService(user.email!, { date, mood });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
