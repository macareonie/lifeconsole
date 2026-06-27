import { useQuery } from "@tanstack/react-query";

import { getAllTimeStats } from "../../services/habittracker/habitstats";

export const useAllTimeStats = () => {
  return useQuery({
    queryKey: ["allTimeHabitStats"],
    queryFn: getAllTimeStats,
  });
};
