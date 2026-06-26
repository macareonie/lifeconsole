import { Flame } from "lucide-react";

import type { Habit } from "../../types/habittracker";

export function StreakBadge({ habit }: { habit: Habit }) {
  console.log("StreakBadge habit:", habit);
  if (habit.current_streak <= 0) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full bg-orange-500/10 px-1.5 py-0.5 text-xs font-medium text-orange-600"
      aria-label={`${habit.current_streak} day streak`}
      title={
        habit.longest_streak > habit.current_streak
          ? `Best: ${habit.longest_streak} days`
          : undefined
      }
    >
      <Flame className="h-3 w-3 text-orange-500" />
      {habit.current_streak}
    </span>
  );
}
