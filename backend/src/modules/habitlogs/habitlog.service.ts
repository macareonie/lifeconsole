import { ServiceError } from "../../errors/service.error.js";
import {
  addHabitLog,
  deleteHabitLogById,
  getAllLogsByHabitId,
  getHabitLogByHabitAndDate,
  getHabitLogById,
  getLogsByDateRange,
  updateHabitLogById,
} from "../../repositories/habitlog.repository.js";
import { getUserIdByEmail } from "../../repositories/user.repository.js";

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

export const getLogsByDateRangeService = async (
  email: string,
  start_date: string,
  end_date: string,
) => {
  if (!email) {
    throw new ServiceError(
      "HabitLogServiceError",
      "User must be authenticated to create a board",
      400,
    );
  }

  const { userId, hasError: userIdError } = await getUserIdByEmail(email);
  if (userIdError) {
    throw new ServiceError(
      "HabitLogServiceError",
      "Internal server error: Getting user ID",
      500,
    );
  }

  if (!userId) {
    throw new ServiceError("HabitLogServiceError", "User not found", 404);
  }
  if (!start_date || !end_date) {
    throw new ServiceError(
      "HabitLogServiceError",
      "Start date and end date are required",
      400,
    );
  }

  const { data, error } = await getLogsByDateRange(
    userId,
    start_date,
    end_date,
  );
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    data: data ?? [],
    message: "Habit logs retrieved successfully",
    success: true,
  };
};

export const toggleHabitLogService = async (habit_id: number, date: string) => {
  const { data: existing, error: lookupError } =
    await getHabitLogByHabitAndDate(habit_id, date);

  if (lookupError) {
    throw new ServiceError("HabitLogServiceError", lookupError.message, 400);
  }

  if (existing) {
    const { error } = await updateHabitLogById(existing.id, {
      completed: !existing.completed,
    });
    if (error) {
      throw new ServiceError("HabitLogServiceError", error.message, 400);
    }
    return {
      message: "Habit log toggled successfully",
      success: true,
    };
  }
  const { error } = await addHabitLog({ habit_id, date, completed: true });
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    message: "Habit log created successfully",
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
