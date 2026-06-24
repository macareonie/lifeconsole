import { getHabitLogsByDateRange } from "@/services/habitlogs";
import { useQuery } from "@tanstack/react-query";

import {
  endOfWeek,
  startOfWeek,
  toIsoDate,
} from "../../utils/habittracker/datetimeHelpers";

import type { HabitLog } from "../../types/habittracker";

export const useHabitLogsByWeek = (weekAnchor: Date) => {
  const start = toIsoDate(startOfWeek(weekAnchor));
  const end = toIsoDate(endOfWeek(weekAnchor));

  return useQuery<{ data: HabitLog[] }>({
    queryKey: ["habitLogs", start, end],
    queryFn: () => getHabitLogsByDateRange(start, end),
  });
};
