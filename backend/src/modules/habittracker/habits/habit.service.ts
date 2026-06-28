import { ServiceError } from "../../../errors/service.error.js";
import {
  addHabit,
  deleteHabitById,
  getAllUserHabits,
  updateHabitById,
} from "../../../repositories/habittracker/habit.repository.js";
import { getUserIdByEmail } from "../../../repositories/user.repository.js";
import { resolveUserId } from "../../../utils/email-to-userId.js";

import type { Habit } from "../../../types/habittracker.js";
export const addHabitService = async (habit: Habit, email: string) => {
  const userId = await resolveUserId(email);
  if (!userId) {
    throw new ServiceError(
      "HabitServiceError",
      "NOT_FOUND",
      "User not found from email",
    );
  }
  const { title } = habit;

  if (!title) {
    throw new ServiceError(
      "HabitServiceError",
      "MISSING_REQUIRED_FIELD",
      "Title is required",
    );
  }
  const { error } = await addHabit(habit, userId);
  if (error) {
    throw new ServiceError(
      "HabitServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Habit created successfully",
    success: true,
  };
};

export const getAllUserHabitsService = async (email: string) => {
  const userId = await resolveUserId(email);
  if (!userId) {
    throw new ServiceError(
      "HabitServiceError",
      "NOT_FOUND",
      "User not found from email",
    );
  }
  const { data, error } = await getAllUserHabits(userId);
  if (error) {
    throw new ServiceError(
      "HabitServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    data: data,
    message: "Habits retrieved successfully",
    success: true,
  };
};

export const updateHabitByIdService = async (
  habitId: number,
  updatedHabit: Partial<{
    title: string;
    frequency: string;
  }>,
) => {
  if (!habitId) {
    throw new ServiceError("HabitServiceError", "NOT_FOUND", "Habit not found");
  }
  const { error } = await updateHabitById(habitId, updatedHabit);
  if (error) {
    throw new ServiceError(
      "HabitServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Habit updated successfully",
    success: true,
  };
};

export const deleteHabitByIdService = async (habitId: number) => {
  if (!habitId) {
    throw new ServiceError("HabitServiceError", "NOT_FOUND", "Habit not found");
  }
  const { error } = await deleteHabitById(habitId);
  if (error) {
    throw new ServiceError(
      "HabitServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }
  return {
    message: "Habit deleted successfully",
    success: true,
  };
};
