import { db } from "../../config/db.js";
import { camelToSnake, snakeToCamel } from "../../utils/case-convert.js";

import type { MoodLog } from "../../types/habittracker.js";
export const upsertMoodLog = async (moodLog: MoodLog, userId: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .upsert(camelToSnake({ ...moodLog, userId }), {
      onConflict: "user_id, date",
    })
    .select()
    .maybeSingle();
  return { data: snakeToCamel(data), error };
};

export const getMoodLogById = async (moodLogId: number) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("id", moodLogId);
  return { data: data?.map(snakeToCamel), error };
};

export const getMoodLogByDate = async (userId: number, date: string) => {
  const { data, error } = await db
    .from("moodlogs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  return { data: snakeToCamel(data), error };
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
  return { data: data?.map(snakeToCamel), error };
};

export const deleteMoodLogById = async (moodLogId: number) => {
  const { error } = await db.from("moodlogs").delete().eq("id", moodLogId);
  return { error };
};
