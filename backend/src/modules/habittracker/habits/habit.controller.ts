import {
  addHabitService,
  deleteHabitByIdService,
  getAllUserHabitsService,
  updateHabitByIdService,
} from "./habit.service.js";

import type { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";
import type { Habit } from "../../../types/habittracker.js";

export const addHabit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = req.body;
  const user = req.user as User;
  try {
    const result = await addHabitService(data as Habit, user.email!);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllUserHabits = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User;
  try {
    const result = await getAllUserHabitsService(user.email!);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateHabitById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const updatedHabit = req.body;
  try {
    const result = await updateHabitByIdService(Number(id), updatedHabit);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteHabitById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await deleteHabitByIdService(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
