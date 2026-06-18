import { db } from '../config/db.js';

import type { MoodLog } from "../types/habittracker.js";

export const addMoodLog = async (moodLog: MoodLog, user_id: number) => {
  const { data, error } = await db
    .from("mood_logs")
    .insert({ ...moodLog, user_id });
  return { data, error };
};

export const getMoodLogById = async (moodLog_id: number) => {
  const { data, error } = await db
    .from("mood_logs")
    .select("*")
    .eq("id", moodLog_id);
  return { data, error };
};

export const getMoodLogByDate = async (user_id: number, date: string) => {
  const { data, error } = await db
    .from("mood_logs")
    .select("*")
    .eq("user_id", user_id)
    .eq("date", date);
  return { data, error };
};

export const getMoodLogByDateRange = async (
  user_id: number,
  startDate: string,
  endDate: string,
) => {
  const { data, error } = await db
    .from("mood_logs")
    .select("*")
    .eq("user_id", user_id)
    .gte("date", startDate)
    .lte("date", endDate);
  return { data, error };
};

export const updateMoodLogById = async (
  moodLog_id: number,
  updates: Partial<MoodLog>,
) => {
  const { data, error } = await db
    .from("mood_logs")
    .update(updates)
    .eq("id", moodLog_id);
  return { data, error };
};

export const deleteHabitLogById = async (habitLog_id: number) => {
  const { data, error } = await db
    .from("habit_logs")
    .delete()
    .eq("id", habitLog_id);
  return { data, error };
};
