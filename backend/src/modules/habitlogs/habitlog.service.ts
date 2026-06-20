import { ServiceError } from "../../errors/service.error.js";
import {
  addHabitLog,
  deleteHabitLogById,
  getAllLogsByHabitId,
  getHabitLogById,
  updateHabitLogById,
} from "../../repositories/habitlog.repository.js";

import type { HabitLog } from "../../types/habittracker.js";

export const addHabitLogService = async (habitLog: HabitLog) => {
  const { data, error } = await addHabitLog(habitLog);
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    message: "Habit log created successfully",
    success: true,
  };
};

export const getHabitLogByIdService = async (habitLog_id: number) => {
  const { data, error } = await getHabitLogById(habitLog_id);
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    data: data,
    message: "Habit log retrieved successfully",
    success: true,
  };
};

export const getAllLogsByHabitIdService = async (habit_id: number) => {
  const { data, error } = await getAllLogsByHabitId(habit_id);
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    data: data,
    message: "Habit logs retrieved successfully",
    success: true,
  };
};

export const updateHabitLogByIdService = async (
  habitLog_id: number,
  updates: Partial<HabitLog>,
) => {
  const { data, error } = await updateHabitLogById(habitLog_id, updates);
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    message: "Habit log updated successfully",
    success: true,
  };
};

export const deleteHabitLogByIdService = async (habitLog_id: number) => {
  const { data, error } = await deleteHabitLogById(habitLog_id);
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    message: "Habit log deleted successfully",
    success: true,
  };
};
