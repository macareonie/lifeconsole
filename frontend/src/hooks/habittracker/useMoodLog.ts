import { useQuery } from "@tanstack/react-query";

import {
  getMoodLogByDate,
  getMoodLogByDateRange,
} from "../../services/moodlogs";
import {
  endOfWeek,
  startOfWeek,
  toIsoDate,
} from "../../utils/habittracker/datetimeHelpers";

import type { MoodLog } from "../../types/habittracker";

export const useMoodLogByDate = (date: Date) => {
  const isoDate = toIsoDate(date);

  return useQuery<MoodLog | null>({
    queryKey: ["moodLog", isoDate],
    queryFn: () => getMoodLogByDate(isoDate),
  });
};

export const useMoodLogsByWeek = (weekAnchor: Date) => {
  const startDate = toIsoDate(startOfWeek(weekAnchor));
  const endDate = toIsoDate(endOfWeek(weekAnchor));

  return useQuery<MoodLog[]>({
    queryKey: ["moodLogs", startDate, endDate],
    queryFn: () => getMoodLogByDateRange(startDate, endDate),
  });
};
