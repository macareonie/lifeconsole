import { ServiceError } from "../../../errors/service.error.js";
import {
  getCompletedDatesForHabit,
  updateHabitStreak,
} from "../../../repositories/habittracker/habit.repository.js";
import {
  getHabitLogByHabitAndDate,
  getLogsByDateRange,
  upsertHabitLog,
} from "../../../repositories/habittracker/habitlog.repository.js";
import { toIsoDate } from "../../../utils/datetime-helpers.js";
import { resolveUserId } from "../../../utils/email-to-userId.js";
import { calculateStreaks } from "../../../utils/streaks-calc.js";

export const getLogsByDateRangeService = async (
  email: string,
  startDate: string,
  endDate: string,
) => {
  const userId = await resolveUserId(email);
  if (!userId) {
    throw new ServiceError(
      "HabitLogServiceError",
      "NOT_FOUND",
      "User not found from email",
    );
  }
  if (!startDate || !endDate) {
    throw new ServiceError(
      "HabitLogServiceError",
      "MISSING_REQUIRED_FIELD",
      "Start date and end date are required",
    );
  }

  const { data, error } = await getLogsByDateRange(userId, startDate, endDate);
  if (error) {
    throw new ServiceError(
      "HabitLogServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    data: data ?? [],
    message: "Habit logs retrieved successfully",
    success: true,
  };
};

export const toggleHabitLogService = async (habitId: number, date: string) => {
  const { data: existing, error: lookupError } =
    await getHabitLogByHabitAndDate(habitId, date);
  if (lookupError) {
    throw new ServiceError(
      "HabitLogServiceError",
      "DATABASE_ERROR",
      lookupError.message,
    );
  }

  const completed = existing ? !existing.completed : true;
  const { error } = await upsertHabitLog({
    habitId,
    date,
    completed,
  });
  if (error) {
    throw new ServiceError(
      "HabitLogServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  await recomputeHabitStreaksService(habitId);
  return {
    message: "Habit log toggled successfully",
    success: true,
  };
};

const recomputeHabitStreaksService = async (habitId: number) => {
  const { data: completedDates, error: completedDatesError } =
    await getCompletedDatesForHabit(habitId);
  if (completedDatesError) {
    throw new ServiceError(
      "HabitLogServiceError",
      "DATABASE_ERROR",
      completedDatesError.message,
    );
  }
  const today = new Date();
  const { currentStreak, longestStreak } = calculateStreaks(
    completedDates ?? [],
    today,
  );

  const { error: updateStreakError } = await updateHabitStreak(
    habitId,
    currentStreak,
    longestStreak,
    toIsoDate(today),
  );
  if (updateStreakError) {
    throw new ServiceError(
      "HabitLogServiceError",
      "DATABASE_ERROR",
      updateStreakError.message,
    );
  }
};
