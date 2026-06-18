export enum HabitFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
}

export type Habit = {
  id: number;
  title: string;
  frequency: HabitFrequency;
};

export type HabitLog = {
  id: number;
  habit_id: number;
  date: String;
  completed: boolean;
};

export type MoodLog = {
  id: number;
  date: String;
  mood: number;
};
