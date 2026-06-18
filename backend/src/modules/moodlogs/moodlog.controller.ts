import {
    addMoodLogService, deleteMoodLogByIdService, getMoodLogByDateService, getMoodLogByIdService,
    updateMoodLogByIdService
} from './moodlog.service.js';

import type { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";
import type { MoodLog } from "../../types/habittracker.js";

export const addMoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as User;
    const data = req.body;

    const result = await addMoodLogService(data as MoodLog, user.email!);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await getMoodLogByIdService(Number(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMoodLogByDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as User;
    const { date } = req.body;
    const result = await getMoodLogByDateService(date, user.email!);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateMoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await updateMoodLogByIdService(Number(id), updates);
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
