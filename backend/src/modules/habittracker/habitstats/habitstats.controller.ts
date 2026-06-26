import { getAllTimeStatsService } from "./habitstats.service.js";

import type { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";

export const getAllTimeStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User;
  try {
    const result = await getAllTimeStatsService(user.email!);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
