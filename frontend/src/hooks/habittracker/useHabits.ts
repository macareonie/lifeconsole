import { useQuery } from "@tanstack/react-query";

import { getAllUserHabits } from "../../services/habittracker/habits";

import type { Habit } from "../../types/habittracker";
export const useHabits = () => {
  return useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: getAllUserHabits,
  });
};
