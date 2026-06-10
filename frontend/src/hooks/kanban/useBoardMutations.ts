import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBoard,
  deleteBoard,
  updateBoard,
  updateBoardLayout,
} from "@/services/boards";

export type updateLayoutBody = {
  columns: {
    id: number;
    card_ids: number[];
  }[];
};

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
    mutationFn: ({ board_id, title }: { board_id: number; title: string }) =>
      updateBoard(board_id, title),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
        queryClient.invalidateQueries({
          queryKey: ["boardContent", variables.board_id],
        }),
      ]);
    },
  });

  const updateLayoutMutation = useMutation({
    mutationFn: ({
      board_id,
      layout,
    }: {
      board_id: number;
      layout: updateLayoutBody;
    }) => updateBoardLayout(board_id, layout),
    onError(_error, variables) {
      queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.board_id],
      });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async (board_id: number) => {
      return deleteBoard(board_id);
    },
    onSuccess: async (_data, board_id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["boards"] }),
        queryClient.invalidateQueries({ queryKey: ["boardContent", board_id] }),
      ]);
    },
  });

  return {
    createBoardMutation,
    updateBoardMutation,
    updateLayoutMutation,
    deleteBoardMutation,
  };
};
