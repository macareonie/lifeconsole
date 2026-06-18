import { db } from '../config/db.js';

import type { Habit } from "../types/habittracker.js";

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
