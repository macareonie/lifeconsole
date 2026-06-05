import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard, deleteBoard, updateBoard } from "@/services/boards";

export const useBoardMutations = () => {
  const queryClient = useQueryClient();

  const createBoardMutation = useMutation({
    mutationFn: async (title: string) => {
      return createBoard(title);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ boardId, title }: { boardId: number; title: string }) =>
      updateBoard(boardId, title),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
        queryClient.invalidateQueries({
          queryKey: ["boardContent", variables.boardId],
        }),
      ]);
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async (boardId: number) => {
      return deleteBoard(boardId);
    },
    onSuccess: async (_data, boardId) => {
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
