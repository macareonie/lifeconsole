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
  userId?: number;
  currentStreak: number;
  longestStreak: number;
  streakUpdatedAt: string | null;
};

export type HabitLog = {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
};

export type MoodLog = {
  id: number;
  date: string;
  mood: number;
};

export type MoodOption = {
  value: number;
  emoji: string;
  label: string;
};

export const MOOD_SCALE: MoodOption[] = [
  { value: 1, emoji: "😞", label: "Awful" },
  { value: 2, emoji: "🙁", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

export type ToggleHabitLogResult = {
  completed: boolean;
};

export type HabitCompletionCount = {
  habitId: number;
  title: string;
  completionCount: number;
};

export type AllTimeStats = {
  totalCompletions: number;
  topHabit: HabitCompletionCount;
  completionCounts: HabitCompletionCount[];
};
