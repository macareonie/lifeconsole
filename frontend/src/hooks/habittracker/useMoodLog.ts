import { useQuery } from "@tanstack/react-query";

import { getMoodLogByDate } from "../../services/moodlogs";
import { toIsoDate } from "../../utils/habittracker/datetimeHelpers";

import type { MoodLog } from "../../types/habittracker";

export const useMoodLogByDate = (date: Date) => {
  const isoDate = toIsoDate(date);

  return useQuery<MoodLog | null>({
    queryKey: ["moodLog", isoDate],
    queryFn: () => getMoodLogByDate(isoDate),
  });
};
