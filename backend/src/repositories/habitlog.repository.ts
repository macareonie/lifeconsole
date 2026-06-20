import { db } from "../config/db.js";

import type { HabitLog } from "../types/habittracker.js";

export const addHabitLog = async (habitLog: HabitLog) => {
  const { data, error } = await db.from("habitlogs").insert(habitLog);
  return { data, error };
};

export const getHabitLogById = async (habitLog_id: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*")
    .eq("id", habitLog_id);
  return { data, error };
};

export const getAllLogsByHabitId = async (habit_id: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*")
    .eq("habit_id", habit_id);
  return { data, error };
};

export const updateHabitLogById = async (
  habitLog_id: number,
  updates: Partial<HabitLog>,
) => {
  const { data, error } = await db
    .from("habitlogs")
    .update(updates)
    .eq("id", habitLog_id);
  return { data, error };
};

export const deleteHabitLogById = async (habitLog_id: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .delete()
    .eq("id", habitLog_id);
  return { data, error };
};
