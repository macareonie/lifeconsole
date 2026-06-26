import { db } from "../config/db.js";

import type { HabitLog } from "../types/habittracker.js";

// export const addHabitLog = async (habitLog: HabitLog) => {
//   const { data, error } = await db.from("habitlogs").insert(habitLog);
//   return { data, error };
// };

// export const updateHabitLogById = async (
//   habitLog_id: number,
//   updates: Partial<HabitLog>,
// ) => {
//   const { data, error } = await db
//     .from("habitlogs")
//     .update(updates)
//     .eq("id", habitLog_id);
//   return { data, error };
// };

// combined into upsert for simplicity since supabase already has upsert functionality

export const upsertHabitLog = async (habitLog: HabitLog) => {
  const { data, error } = await db
    .from("habitlogs")
    .upsert(habitLog, { onConflict: "habit_id, date" })
    .select()
    .maybeSingle();
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

export const getLogsByDateRange = async (
  user_id: number,
  start_date: string,
  end_date: string,
) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*, habits!inner(user_id)")
    .eq("habits.user_id", user_id)
    .gte("date", start_date)
    .lte("date", end_date);
  return { data, error };
};

export const getHabitLogByHabitAndDate = async (
  habit_id: number,
  date: string,
) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*")
    .eq("habit_id", habit_id)
    .eq("date", date)
    .maybeSingle();
  return { data, error };
};

export const deleteHabitLogById = async (habitLog_id: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .delete()
    .eq("id", habitLog_id);
  return { data, error };
};

type AlltimeCompletionRow = {
  habit_id: number;
  habits: { title: string };
};

export const getAllTimeCompletions = async (user_id: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("habit_id, habits!inner(title)")
    .eq("habits.user_id", user_id)
    .eq("completed", true);

  return { data: data as AlltimeCompletionRow[] | null, error };
};
