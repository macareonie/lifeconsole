import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn, deleteColumn, updateColumn } from "@/services/columns";

type CreateColumnVariables = {
  title: string;
  boardId: number;
  position: number;
};

type UpdateColumnVariables = {
  columnId: number;
  boardId: number;
  title: string;
  position: number;
};

type DeleteColumnVariables = {
  columnId: number;
  boardId: number;
};

export const useColumnMutations = () => {
  const queryClient = useQueryClient();

  const createColumnMutation = useMutation({
    mutationFn: (variables: CreateColumnVariables) => createColumn(variables),
    onSuccess: async (boardId: number) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", boardId],
      });
    },
  });

  const updateColumnMutation = useMutation({
    mutationFn: (variables: UpdateColumnVariables) =>
      updateColumn({
        columnId: variables.columnId,
        title: variables.title,
        position: variables.position,
      }),
    onSuccess: async (boardId: number) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", boardId],
      });
    },
  });

  const deleteColumnMutation = useMutation({
    mutationFn: (variables: DeleteColumnVariables) =>
      deleteColumn(variables.columnId),
    onSuccess: async (boardId: number) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", boardId],
      });
    },
  });

  return {
    createColumnMutation,
    updateColumnMutation,
    deleteColumnMutation,
  };
};
