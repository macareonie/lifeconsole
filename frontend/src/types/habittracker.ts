const HabitFrequency = {
  DAILY: "daily",
  WEEKLY: "weekly",
};

export type HabitFrequency =
  (typeof HabitFrequency)[keyof typeof HabitFrequency];

export type Habit = {
  id: number;
  title: string;
  frequency: HabitFrequency;
  user_id?: number;
};

export type HabitLog = {
  id: number;
  habit_id: number;
  date: string;
  completed: boolean;
};

export type MoodLog = {
  id: number;
  date: string;
  mood: number;
};
