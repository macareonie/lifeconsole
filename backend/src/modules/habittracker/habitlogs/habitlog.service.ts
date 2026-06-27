import { ServiceError } from "../../../errors/service.error.js";
import {
  getCompletedDatesForHabit,
  updateHabitStreak,
} from "../../../repositories/habittracker/habit.repository.js";
import {
  deleteHabitLogById,
  getAllLogsByHabitId,
  getHabitLogByHabitAndDate,
  getLogsByDateRange,
  upsertHabitLog,
} from "../../../repositories/habittracker/habitlog.repository.js";
import { toIsoDate } from "../../../utils/datetime-helpers.js";
import { resolveUserId } from "../../../utils/email2userid.js";
import { calculateStreaks } from "../../../utils/streaks-calc.js";

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
  if (existing && lookupError) {
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

  console.log("start streak recompute");
  await recomputeHabitStreaksService(habit_id);
  console.log("end streak recompute");

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

export const recomputeHabitStreaksService = async (habit_id: number) => {
  const { data: completedDates, error: completedDatesError } =
    await getCompletedDatesForHabit(habit_id);
  if (completedDatesError) {
    throw new ServiceError(
      "HabitServiceError",
      completedDatesError.message,
      400,
    );
  }
  const today = new Date();
  const { currentStreak, longestStreak } = calculateStreaks(
    completedDates ?? [],
    today,
  );

  const { error: updateStreakError } = await updateHabitStreak(
    habit_id,
    currentStreak,
    longestStreak,
    toIsoDate(today),
  );
  if (updateStreakError) {
    throw new ServiceError("HabitServiceError", updateStreakError.message, 400);
  }
};
