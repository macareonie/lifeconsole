export enum HabitFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
}

export type Habit = {
  id?: number;
  title: string;
  frequency: HabitFrequency;
  current_streak: number;
  longest_streak: number;
  streak_updated_at: string | null;
};

export type HabitLog = {
  id?: number;
  habit_id: number;
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
