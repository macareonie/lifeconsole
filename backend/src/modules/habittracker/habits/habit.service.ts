import { ServiceError } from "../../../errors/service.error.js";
import {
  addHabit,
  deleteHabitById,
  getAllUserHabits,
  updateHabitById,
} from "../../../repositories/habittracker/habit.repository.js";
import { getUserIdByEmail } from "../../../repositories/user.repository.js";

import type { Habit } from "../../../types/habittracker.js";

const habitNotFoundError = new ServiceError(
  "HabitServiceError",
  "Habit not found! Time to create one!",
  404,
);

const userNotFoundError = new ServiceError(
  "HabitServiceError",
  "User not found! Time to create one!",
  404,
);

export const addHabitService = async (habit: Habit, email: string) => {
  if (!email) {
    throw new ServiceError(
      "HabitServiceError",
      "User must be authenticated to create a habit",
      400,
    );
  }

  const { userId, hasError: userIdError } = await getUserIdByEmail(email);
  if (userIdError) {
    throw new ServiceError(
      "HabitServiceError",
      "Internal server error: Getting user ID",
      500,
    );
  }
  const { title } = habit;
  if (!userId) {
    throw userNotFoundError;
  }
  if (!title) {
    throw new ServiceError("HabitServiceError", "Title is required", 400);
  }
  const { data, error } = await addHabit(habit, userId);
  if (error) {
    throw new ServiceError("HabitServiceError", error.message, 400);
  }
  return {
    message: "Habit created successfully",
    success: true,
  };
};

export const getAllUserHabitsService = async (email: string) => {
  if (!email) {
    throw new ServiceError(
      "HabitServiceError",
      "User must be authenticated to get habits",
      400,
    );
  }

  const { userId, hasError: userIdError } = await getUserIdByEmail(email);
  if (userIdError) {
    throw new ServiceError(
      "HabitServiceError",
      "Internal server error: Getting user ID",
      500,
    );
  }

  if (!userId) {
    throw userNotFoundError;
  }
  const { data, error } = await getAllUserHabits(userId);
  if (error) {
    throw new ServiceError("HabitServiceError", error.message, 400);
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
    throw habitNotFoundError;
  }
  const { data, error } = await updateHabitById(habitId, updatedHabit);
  if (error) {
    throw new ServiceError("HabitServiceError", error.message, 400);
  }
  return {
    message: "Habit updated successfully",
    success: true,
  };
};

export const deleteHabitByIdService = async (habitId: number) => {
  if (!habitId) {
    throw habitNotFoundError;
  }
  const { data, error } = await deleteHabitById(habitId);
  if (error) {
    throw new ServiceError("HabitServiceError", error.message, 400);
  }
  return {
    message: "Habit deleted successfully",
    success: true,
  };
};
