import { CheckCircle2, Trophy } from "lucide-react";

import { useAllTimeStats } from "../../hooks/habittracker/useAllTimeStats";

import type { Habit } from "@/types/habittracker";

export function AllTimeStatsSection({ habits }: { habits: Habit[] }) {
  const { data, isLoading } = useAllTimeStats();

  // Longest streak across all habits is free — already on each habit
  // object from useHabits(), no extra fetch needed for this one stat.
  const longestStreakHabit = habits.reduce<Habit | null>((best, h) => {
    if (!best || h.longestStreak > best.longestStreak) return h;
    return best;
  }, null);

  if (isLoading) {
    return <p className="text-xs text-muted-foreground">Loading stats...</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3">
        <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Longest streak</p>
          <p className="truncate text-sm font-medium text-foreground">
            {longestStreakHabit && longestStreakHabit.longestStreak > 0
              ? `${longestStreakHabit.title} — ${longestStreakHabit.longestStreak} days`
              : "No streaks yet"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Top habit</p>
          <p className="truncate text-sm font-medium text-foreground">
            {data?.topHabit
              ? `${data.topHabit.title} — ${data.topHabit.completionCount} completions all time`
              : "No completions yet"}
          </p>
        </div>
      </div>

      <p className="px-1 text-xs text-muted-foreground">
        {data?.totalCompletions ?? 0} total completions across all habits
      </p>
    </div>
  );
}
