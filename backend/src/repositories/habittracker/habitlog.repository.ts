import { db } from "../../config/db.js";
import { camelToSnake, snakeToCamel } from "../../utils/case-convert.js";

import type { HabitLog } from "../../types/habittracker.js";
export const upsertHabitLog = async (habitLog: HabitLog) => {
  const { data, error } = await db
    .from("habitlogs")
    .upsert(camelToSnake(habitLog), { onConflict: "habit_id, date" })
    .select()
    .maybeSingle();
  return { data: snakeToCamel(data), error };
};

export const getHabitLogById = async (habitLogId: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*")
    .eq("id", habitLogId);
  return { data: data?.map(snakeToCamel), error };
};

export const getAllLogsByHabitId = async (habitId: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*")
    .eq("habit_id", habitId);
  return { data: data?.map(snakeToCamel), error };
};

export const getLogsByDateRange = async (
  userId: number,
  startDate: string,
  endDate: string,
) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*, habits!inner(user_id)")
    .eq("habits.user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);
  return { data: data?.map(snakeToCamel), error };
};

export const getHabitLogByHabitAndDate = async (
  habitId: number,
  date: string,
) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("*")
    .eq("habit_id", habitId)
    .eq("date", date)
    .maybeSingle();
  return { data: snakeToCamel(data), error };
};

export const deleteHabitLogById = async (habitLogId: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .delete()
    .eq("id", habitLogId);
  return { data, error };
};

type AlltimeCompletionRow = {
  habit_id: number;
  habits: { title: string };
};

export const getAllTimeCompletions = async (userId: number) => {
  const { data, error } = await db
    .from("habitlogs")
    .select("habit_id, habits!inner(title)")
    .eq("habits.user_id", userId)
    .eq("completed", true);

  return {
    data: data?.map(snakeToCamel) as AlltimeCompletionRow[] | null,
    error,
  };
};
