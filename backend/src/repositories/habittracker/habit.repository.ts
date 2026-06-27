import { db } from "../../config/db.js";

import type { Habit } from "../../types/habittracker.js";

export const addHabit = async (habit: Habit, userId: number) => {
  const { data, error } = await db
    .from("habits")
    .insert({ ...habit, user_id: userId });
  return { data, error };
};

export const getAllUserHabits = async (userId: number) => {
  const { data, error } = await db
    .from("habits")
    .select("*")
    .eq("user_id", userId);
  return { data, error };
};

export const updateHabitById = async (
  habitId: number,
  updates: Partial<Habit>,
) => {
  const { data, error } = await db
    .from("habits")
    .update(updates)
    .eq("id", habitId);
  return { data, error };
};

export const deleteHabitById = async (habitId: number) => {
  const { data, error } = await db.from("habits").delete().eq("id", habitId);
  return { data, error };
};

export const getCompletedDatesForHabit = async (habitId: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("date")
    .eq("habit_id", habitId)
    .eq("completed", true);
  return {
    data: data?.map((log) => log.date as string) ?? null,
    error,
  };
};

export const updateHabitStreak = async (
  habitId: number,
  currentStreak: number,
  longestStreak: number,
  asOfDate: string,
) => {
  const { data, error } = await db
    .from("habits")
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      streak_updated_at: asOfDate,
    })
    .eq("id", habitId);
  return { data, error };
};
