import { ServiceError } from '../../errors/service.error.js';
import {
    addMoodLog, deleteHabitLogById, getMoodLogByDate, getMoodLogById, updateMoodLogById
} from '../../repositories/moodlog.repository.js';
import { getUserIdByEmail } from '../../repositories/user.repository.js';

import type { MoodLog } from "../../types/habittracker.js";

export const addMoodLogService = async (moodLog: MoodLog, email: string) => {
  if (!email) {
    throw new ServiceError(
      "MoodLogServiceError",
      "User must be authenticated to create a mood log",
      400,
    );
  }
  const { userId, hasError: userIdError } = await getUserIdByEmail(email);
  if (userIdError) {
    throw new ServiceError(
      "MoodLogServiceError",
      "Internal server error: Getting user ID",
      500,
    );
  }
  const { data, error } = await addMoodLog(moodLog, userId);
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    message: "Mood log created successfully",
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
  if (!email) {
    throw new ServiceError(
      "MoodLogServiceError",
      "User must be authenticated to create a mood log",
      400,
    );
  }
  const { userId, hasError: userIdError } = await getUserIdByEmail(email);
  if (userIdError) {
    throw new ServiceError(
      "MoodLogServiceError",
      "Internal server error: Getting user ID",
      500,
    );
  }
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

export const updateMoodLogByIdService = async (
  moodLog_id: number,
  updates: Partial<MoodLog>,
) => {
  const { data, error } = await updateMoodLogById(moodLog_id, updates);
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    message: "Mood log updated successfully",
    success: true,
  };
};

export const deleteMoodLogByIdService = async (moodLog_id: number) => {
  const { data, error } = await deleteHabitLogById(moodLog_id);
  if (error) {
    throw new ServiceError("MoodLogServiceError", error.message, 400);
  }
  return {
    message: "Mood log deleted successfully",
    success: true,
  };
};
