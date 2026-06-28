import { toggleHabitLog } from "@/services/habittracker/habitlogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useHabitLogMutations = () => {
  const queryClient = useQueryClient();

  // Toggles completion for a given day. If a log already exists for that
  // date, flips its `completed` flag via PUT; otherwise creates a new log
  // via POST with completed: true (first click always marks done).
  const toggleHabitLogMutation = useMutation({
    mutationFn: async ({
      habitId,
      date,
    }: {
      habitId: number;
      date: string;
    }) => {
      return toggleHabitLog(habitId, date);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["habitLogs"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["habits"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["allTimeHabitStats"],
      });
    },
  });

  return { toggleHabitLogMutation };
};
