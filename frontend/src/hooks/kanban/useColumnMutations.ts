import { createColumn, deleteColumn, updateColumn } from "@/services/columns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateColumnVariables = {
  title: string;
  board_id: number;
  position: number;
};

type UpdateColumnVariables = {
  column_id: number;
  board_id: number;
  title: string;
  position: number;
};

type DeleteColumnVariables = {
  column_id: number;
  board_id: number;
};

export const useColumnMutations = () => {
  const queryClient = useQueryClient();

  const createColumnMutation = useMutation({
    mutationFn: (variables: CreateColumnVariables) => createColumn(variables),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.board_id],
      });
    },
  });

  const updateColumnMutation = useMutation({
    mutationFn: (variables: UpdateColumnVariables) =>
      updateColumn({
        column_id: variables.column_id,
        title: variables.title,
        position: variables.position,
      }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.board_id],
      });
    },
  });

  const deleteColumnMutation = useMutation({
    mutationFn: (variables: DeleteColumnVariables) =>
      deleteColumn(variables.column_id),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.board_id],
      });
    },
  });

  return {
    createColumnMutation,
    updateColumnMutation,
    deleteColumnMutation,
  };
};
