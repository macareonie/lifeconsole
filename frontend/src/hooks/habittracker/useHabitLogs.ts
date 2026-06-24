import { useMemo } from "react";

import { useHabitLogsByWeek } from "./useHabitLogsByWeek";

import type { HabitLog } from "../../types/habittracker";

// Wraps the single range-query fetch and reshapes the flat array into
// Map<habit_id, Map<isoDate, HabitLog>> for O(1) lookups in the grid.
export const useHabitLogs = (weekAnchor: Date) => {
  const { data, isPending, isError } = useHabitLogsByWeek(weekAnchor);

  const logsByHabit = useMemo(() => {
    const map = new Map<number, Map<string, HabitLog>>();
    const logs = data?.data ?? [];

    for (const log of logs) {
      const isoDate = log.date.slice(0, 10);
      if (!map.has(log.habit_id)) {
        map.set(log.habit_id, new Map());
      }
      map.get(log.habit_id)!.set(isoDate, log);
    }

    return map;
  }, [data]);

  return { logsByHabit, isPending, isError };
};
