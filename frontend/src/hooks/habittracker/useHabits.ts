import { useQuery } from "@tanstack/react-query";

import { getAllUserHabits } from "../../services/habits";

import type { Habit } from "../../types/habittracker";
export const useHabits = () => {
  return useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: getAllUserHabits,
  });
};
