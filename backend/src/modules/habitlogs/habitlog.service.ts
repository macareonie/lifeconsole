import { ServiceError } from "../../errors/service.error.js";
import {
  deleteHabitLogById,
  getAllLogsByHabitId,
  getHabitLogByHabitAndDate,
  getHabitLogById,
  getLogsByDateRange,
  upsertHabitLog,
} from "../../repositories/habitlog.repository.js";
import { resolveUserId } from "../../utils/email2userid.js";

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
  const userId = await resolveUserId(email);
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

  const completed = existing ? !existing.completed : true;
  const { error } = await upsertHabitLog({
    id: existing?.id,
    habit_id,
    date,
    completed,
  });
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }
  return {
    message: "Habit log toggled successfully",
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
