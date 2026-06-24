import { setMoodLog } from "@/services/moodlogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMoodLogMutations = () => {
  const queryClient = useQueryClient();

  const setMoodLogMutation = useMutation({
    mutationFn: async ({ date, mood }: { date: string; mood: number }) => {
      return setMoodLog(date, mood);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["moodLog", variables.date],
      });
    },
  });

  return { setMoodLogMutation };
};
