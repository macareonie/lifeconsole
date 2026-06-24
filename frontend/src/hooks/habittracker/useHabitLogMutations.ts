import { toggleHabitLog } from "@/services/habitlogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useHabitLogMutations = () => {
  const queryClient = useQueryClient();

  // Toggles completion for a given day. If a log already exists for that
  // date, flips its `completed` flag via PUT; otherwise creates a new log
  // via POST with completed: true (first click always marks done).
  const toggleHabitLogMutation = useMutation({
    mutationFn: async ({
      habit_id,
      date,
    }: {
      habit_id: number;
      date: string;
    }) => {
      return toggleHabitLog(habit_id, date);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["habitLogs"],
      });
    },
  });

  return { toggleHabitLogMutation };
};
