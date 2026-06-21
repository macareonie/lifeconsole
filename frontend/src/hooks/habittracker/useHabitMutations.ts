import { addHabit, deleteHabit, updateHabit } from "@/services/habits";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { HabitFrequency } from "../../types/habittracker";

export const useHabitMutations = () => {
  const queryClient = useQueryClient();

  const createHabitMutation = useMutation({
    mutationFn: ({
      title,
      frequency,
    }: {
      title: string;
      frequency: HabitFrequency;
    }) => addHabit(title, frequency),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({
      id,
      title,
      frequency,
    }: {
      id: number;
      title: string;
      frequency: HabitFrequency;
    }) => updateHabit(id, title, frequency),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id: number) => deleteHabit(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["habits"] });
      // Logs belonging to a deleted habit are stale too
      await queryClient.invalidateQueries({ queryKey: ["habitLogs"] });
    },
  });

  return { createHabitMutation, updateHabitMutation, deleteHabitMutation };
};
