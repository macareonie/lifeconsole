import { getAllLogsByHabitId } from "@/services/habitlogs";
import { useQueries } from "@tanstack/react-query";

import type { Habit, HabitLog } from "../../types/habittracker";

// Fetches logs for every habit in parallel and flattens into one array.
// keyed by habit_id so the calendar grid can do O(1) lookups.
export const useHabitLogs = (habits: Habit[] | undefined) => {
  const results = useQueries({
    queries: (habits ?? []).map((habit) => ({
      queryKey: ["habitLogs", habit.id],
      queryFn: () => getAllLogsByHabitId(habit.id),
      enabled: !!habits,
    })),
  });

  const isPending = results.some((r) => r.isPending);
  const isError = results.some((r) => r.isError);

  // Map of habit_id -> Map of ISO date -> HabitLog, for fast lookup when
  // rendering the grid.
  const logsByHabit = new Map<number, Map<string, HabitLog>>();

  results.forEach((result, index) => {
    const habit = habits?.[index];
    if (!habit || !result.data) return;
    const logMap = new Map<string, HabitLog>();
    const logs: HabitLog[] = result.data.data ?? result.data;
    logs.forEach((log) => logMap.set(log.date, log));
    logsByHabit.set(habit.id, logMap);
  });

  return { logsByHabit, isPending, isError };
};
