import { db } from "../../config/db.js";

import type { MoodLog } from "../../types/habittracker.js";

export const upsertMoodLog = async (moodLog: MoodLog, user_id: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .upsert({ ...moodLog, user_id }, { onConflict: "user_id, date" })
    .select()
    .maybeSingle();
  return { data, error };
};

export const getMoodLogById = async (moodLog_id: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("id", moodLog_id);
  return { data, error };
};

export const getMoodLogByDate = async (user_id: number, date: string) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("user_id", user_id)
    .eq("date", date)
    .maybeSingle();
  return { data, error };
};

export const getMoodLogByDateRange = async (
  user_id: number,
  startDate: string,
  endDate: string,
) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("user_id", user_id)
    .gte("date", startDate)
    .lte("date", endDate);
  return { data, error };
};

export const deleteMoodLogById = async (moodLog_id: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .delete()
    .eq("id", moodLog_id);
  return { data, error };
};
