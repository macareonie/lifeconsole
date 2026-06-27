import { db } from "../../config/db.js";

import type { Habit } from "../../types/habittracker.js";

export const addHabit = async (habit: Habit, user_id: number) => {
  const { data, error } = await db.from("habits").insert({ ...habit, user_id });
  return { data, error };
};

export const getAllUserHabits = async (user_id: number) => {
  const { data, error } = await db
    .from("habits")
    .select("*")
    .eq("user_id", user_id);
  return { data, error };
};

export const updateHabitById = async (
  habit_id: number,
  updates: Partial<Habit>,
) => {
  const { data, error } = await db
    .from("habits")
    .update(updates)
    .eq("id", habit_id);
  return { data, error };
};

export const deleteHabitById = async (habit_id: number) => {
  const { data, error } = await db.from("habits").delete().eq("id", habit_id);
  return { data, error };
};

export const getCompletedDatesForHabit = async (habit_id: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("date")
    .eq("habit_id", habit_id)
    .eq("completed", true);
  return {
    data: data?.map((log) => log.date as string) ?? null,
    error,
  };
};

export const updateHabitStreak = async (
  habit_id: number,
  current_streak: number,
  longest_streak: number,
  asOfDate: string,
) => {
  const { data, error } = await db
    .from("habits")
    .update({
      current_streak,
      longest_streak,
      streak_updated_at: asOfDate,
    })
    .eq("id", habit_id);
  return { data, error };
};
