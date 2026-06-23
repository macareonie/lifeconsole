import { ServiceError } from "../../errors/service.error.js";
import {
  deleteMoodLogById,
  getMoodLogByDate,
  getMoodLogByDateRange,
  getMoodLogById,
  upsertMoodLog,
} from "../../repositories/moodlog.repository.js";
import { MOOD_MAX, MOOD_MIN } from "../../types/habittracker.js";
import { resolveUserId } from "../../utils/email2userid.js";

import type { MoodLog } from "../../types/habittracker.js";
function validateMood(mood: number) {
  if (typeof mood !== "number" || mood < MOOD_MIN || mood > MOOD_MAX) {
    throw new ServiceError(
      "MoodLogServiceError",
      `Mood must be a number between ${MOOD_MIN} and ${MOOD_MAX}`,
      400,
    );
  }
}

export const setMoodLogService = async (email: string, moodLog: MoodLog) => {
  validateMood(moodLog.mood);
  const userId = await resolveUserId(email);
  if (!userId) {
    throw new ServiceError("MoodLogServiceError", "User not found", 404);
  }

  const { data, error } = await upsertMoodLog(moodLog, userId);
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    data,
    message: "Mood log set successfully",
    success: true,
  };
};

export const getMoodLogByIdService = async (id: number) => {
  const { data, error } = await getMoodLogById(id);
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    data,
    message: "Mood log retrieved successfully",
    success: true,
  };
};

export const getMoodLogByDateService = async (date: string, email: string) => {
  const userId = await resolveUserId(email);
  const { data, error } = await getMoodLogByDate(userId, date);
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    data,
    message: "Mood log retrieved successfully",
    success: true,
  };
};

export const getMoodLogByDateRangeService = async (
  email: string,
  startDate: string,
  endDate: string,
) => {
  const userId = await resolveUserId(email);
  if (!startDate || !endDate) {
    throw new ServiceError(
      "MoodLogServiceError",
      "Start date and end date are required",
      400,
    );
  }

  const { data, error } = await getMoodLogByDateRange(
    userId,
    startDate,
    endDate,
  );
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    data: data ?? [],
    message: "Mood logs retrieved successfully",
    success: true,
  };
};

export const deleteMoodLogByIdService = async (moodLog_id: number) => {
  const { data, error } = await deleteMoodLogById(moodLog_id);
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    message: "Mood log deleted successfully",
    success: true,
  };
};
