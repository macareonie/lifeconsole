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
    throw new ServiceError("HabitLogServiceError", "User not found", 404);
  }
  if (!startDate || !endDate) {
    throw new ServiceError(
      "HabitLogServiceError",
      "Start date and end date are required",
      400,
    );
  }

  const { data, error } = await getLogsByDateRange(userId, startDate, endDate);
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
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
  if (existing && lookupError) {
    throw new ServiceError("HabitLogServiceError", lookupError.message, 400);
  }

  const completed = existing ? !existing.completed : true;
  const { error } = await upsertHabitLog({
    id: existing?.id,
    habitId,
    date,
    completed,
  });
  if (error) {
    throw new ServiceError("HabitLogServiceError", error.message, 400);
  }

  console.log("start streak recompute");
  await recomputeHabitStreaksService(habitId);
  console.log("end streak recompute");

  return {
    message: "Habit log toggled successfully",
    success: true,
  };
};

const recomputeHabitStreaksService = async (habit_id: number) => {
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
