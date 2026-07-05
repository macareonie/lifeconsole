import { ServiceError } from "../../../errors/service.error.js";
import {
  getMoodLogByDate,
  getMoodLogByDateRange,
  upsertMoodLog,
} from "../../../repositories/habittracker/moodlog.repository.js";
import { MOOD_MAX, MOOD_MIN } from "../../../types/habittracker.js";
import { resolveUserId } from "../../../utils/email-to-userId.js";

import type { MoodLog } from "../../../types/habittracker.js";

function validateMood(mood: number) {
  if (typeof mood !== "number" || mood < MOOD_MIN || mood > MOOD_MAX) {
    throw new ServiceError(
      "MoodLogServiceError",
      "INVALID_MOOD_VALUE",
      `Mood must be a number between ${MOOD_MIN} and ${MOOD_MAX}`,
    );
  }
}

export const setMoodLogService = async (email: string, moodLog: MoodLog) => {
  validateMood(moodLog.mood);
  const userId = await resolveUserId(email);
  if (!userId) {
    throw new ServiceError(
      "MoodLogServiceError",
      "NOT_FOUND",
      "User not found from email",
    );
  }

  const { data, error } = await upsertMoodLog(moodLog, userId);
  if (error) {
    throw new ServiceError(
      "MoodLogServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    data,
    message: "Mood log set successfully",
    success: true,
  };
};

export const getMoodLogByDateService = async (email: string, date: string) => {
  const userId = await resolveUserId(email);
  const { data, error } = await getMoodLogByDate(userId, date);
  if (error) {
    throw new ServiceError(
      "MoodLogServiceError",
      "DATABASE_ERROR",
      error.message,
    );
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
      "MISSING_REQUIRED_FIELD",
      "Start date and end date are required",
    );
  }

  const { data, error } = await getMoodLogByDateRange(
    userId,
    startDate,
    endDate,
  );
  if (error) {
    throw new ServiceError(
      "MoodLogServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    data: data ?? [],
    message: "Mood logs retrieved successfully",
    success: true,
  };
};
