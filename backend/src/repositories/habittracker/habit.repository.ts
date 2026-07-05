import { db } from "../../config/db.js";
import { camelToSnake, snakeToCamel } from "../../utils/case-convert.js";

import type { Habit } from "../../types/habittracker.js";
export const addHabit = async (habit: Habit, userId: number) => {
  const { data, error } = await db
    .from("habits")
    .insert(camelToSnake({ ...habit, userId }));
  return { data, error };
};

export const getAllUserHabits = async (userId: number) => {
  const { data, error } = await db
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: true });
  return { data: data?.map(snakeToCamel), error };
};

export const updateHabitById = async (
  habitId: number,
  updates: Partial<{
    title: string;
    frequency: string;
  }>,
) => {
  const { data, error } = await db
    .from("habits")
    .update(camelToSnake(updates))
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
    data: data?.map(snakeToCamel).map((log) => log.date as string) ?? null,
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
    .update(
      camelToSnake({
        currentStreak,
        longestStreak,
        streakUpdatedAt: asOfDate,
      }),
    )
    .eq("id", habitId);
  return { data, error };
};
