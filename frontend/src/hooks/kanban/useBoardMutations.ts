import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard, deleteBoard, updateBoard } from "@/services/boards";

export const useBoardMutations = () => {
  const queryClient = useQueryClient();

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ boardId, title }: { boardId: number; title: string }) =>
      updateBoard(boardId, title),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
        queryClient.invalidateQueries({
          queryKey: ["boardContent", variables.boardId],
        }),
      ]);
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: async (_, boardId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
        queryClient.invalidateQueries({ queryKey: ["boardContent", boardId] }),
      ]);
    },
  });

  return {
    createBoardMutation,
    updateBoardMutation,
    deleteBoardMutation,
  };
};
