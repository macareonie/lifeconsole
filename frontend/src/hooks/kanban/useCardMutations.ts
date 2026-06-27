import { createCard, deleteCard, updateCard } from "@/services/kanban/cards";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { JsonValue } from "@/types/json";

type CreateCardVariables = {
  board_id: number;
  title: string;
  subtitle: string;
  column_id: number;
  position: number;
  metadata: JsonValue;
};

type UpdateCardVariables = {
  board_id: number;
  card_id: number;
  title: string;
  subtitle: string;
  column_id: number;
  position: number;
  metadata: JsonValue;
};

type DeleteCardVariables = {
  board_id: number;
  card_id: number;
};

export const useCardMutations = () => {
  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: (variables: CreateCardVariables) =>
      createCard({
        title: variables.title,
        subtitle: variables.subtitle,
        column_id: variables.column_id,
        position: variables.position,
        metadata: variables.metadata,
      }),
    onSuccess: async (_data, variables: CreateCardVariables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.board_id],
      });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: (variables: UpdateCardVariables) =>
      updateCard({
        card_id: variables.card_id,
        title: variables.title,
        subtitle: variables.subtitle,
        column_id: variables.column_id,
        position: variables.position,
        metadata: variables.metadata,
      }),
    onSuccess: async (_data, variables: UpdateCardVariables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.board_id],
      });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (variables: DeleteCardVariables) =>
      deleteCard(variables.card_id),
    onSuccess: async (_data, variables: DeleteCardVariables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.board_id],
      });
    },
  });

  return {
    createCardMutation,
    updateCardMutation,
    deleteCardMutation,
  };
};
