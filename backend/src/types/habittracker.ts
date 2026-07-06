export enum HabitFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
}

export type Habit = {
  id?: number;
  title: string;
  frequency: HabitFrequency;
  currentStreak: number;
  longestStreak: number;
  streakUpdatedAt: string | null;
};

export type HabitLog = {
  id?: number;
  habitId: number;
  date: string;
  completed: boolean;
};

export type MoodLog = {
  id?: number;
  date: string;
  mood: number;
};

export const MOOD_MIN = 1;
export const MOOD_MAX = 5;
