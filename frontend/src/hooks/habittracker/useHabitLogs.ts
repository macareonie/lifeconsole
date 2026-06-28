import { useMemo } from "react";

import { getHabitLogsByDateRange } from "@/services/habittracker/habitlogs";
import { useQuery } from "@tanstack/react-query";

import {
  endOfWeek,
  startOfWeek,
  toIsoDate,
} from "../../utils/habittracker/datetimeHelpers";

import type { HabitLog } from "../../types/habittracker";

const useHabitLogsByWeek = (weekAnchor: Date) => {
  const start = toIsoDate(startOfWeek(weekAnchor));
  const end = toIsoDate(endOfWeek(weekAnchor));

  return useQuery<{ data: HabitLog[] }>({
    queryKey: ["habitLogs", start, end],
    queryFn: () => getHabitLogsByDateRange(start, end),
  });
};

// Wraps the single range-query fetch and reshapes the flat array into
// Map<habitId, Map<isoDate, HabitLog>> for O(1) lookups in the grid.
export const useHabitLogs = (weekAnchor: Date) => {
  const { data, isPending, isError } = useHabitLogsByWeek(weekAnchor);

  // logs data is retrieved correctly but mismatch due to habitId vs habit_id

  const logsByHabit = useMemo(() => {
    const map = new Map<number, Map<string, HabitLog>>();
    const logs = data?.data ?? [];

    for (const log of logs) {
      const isoDate = toIsoDate(new Date(log.date));
      if (!map.has(log.habitId)) {
        map.set(log.habitId, new Map());
      }
      map.get(log.habitId)!.set(isoDate, log);
    }

    return map;
  }, [data]);

  return { logsByHabit, isPending, isError };
};
