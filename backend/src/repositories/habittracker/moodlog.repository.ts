import { db } from "../../config/db.js";

import type { MoodLog } from "../../types/habittracker.js";

export const upsertMoodLog = async (moodLog: MoodLog, userId: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .upsert({ ...moodLog, user_id: userId }, { onConflict: "user_id, date" })
    .select()
    .maybeSingle();
  return { data, error };
};

export const getMoodLogById = async (moodLogId: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("id", moodLogId);
  return { data, error };
};

export const getMoodLogByDate = async (userId: number, date: string) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  return { data, error };
};

export const getMoodLogByDateRange = async (
  userId: number,
  startDate: string,
  endDate: string,
) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);
  return { data, error };
};

export const deleteMoodLogById = async (moodLogId: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .delete()
    .eq("id", moodLogId);
  return { data, error };
};
