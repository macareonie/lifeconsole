import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type JsonValue } from "@/types/json";
import { createCard, deleteCard, updateCard } from "@/services/cards";

type CreateCardVariables = {
  boardId: number;
  title: string;
  subtitle: string;
  columnId: number;
  position: number;
  metadata: JsonValue;
};

type UpdateCardVariables = {
  boardId: number;
  cardId: number;
  title: string;
  subtitle: string;
  columnId: number;
  position: number;
  metadata: JsonValue;
};

type DeleteCardVariables = {
  boardId: number;
  cardId: number;
};

export const useCardMutations = () => {
  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: (variables: CreateCardVariables) =>
      createCard({
        title: variables.title,
        subtitle: variables.subtitle,
        columnId: variables.columnId,
        position: variables.position,
        metadata: variables.metadata,
      }),
    onSuccess: async (variables: CreateCardVariables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.boardId],
      });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: (variables: UpdateCardVariables) =>
      updateCard({
        cardId: variables.cardId,
        title: variables.title,
        subtitle: variables.subtitle,
        columnId: variables.columnId,
        position: variables.position,
        metadata: variables.metadata,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.boardId],
      });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (variables: DeleteCardVariables) =>
      deleteCard(variables.cardId),
    onSuccess: async (variables: DeleteCardVariables) => {
      await queryClient.invalidateQueries({
        queryKey: ["boardContent", variables.boardId],
      });
    },
  });

  return {
    createCardMutation,
    updateCardMutation,
    deleteCardMutation,
  };
};
