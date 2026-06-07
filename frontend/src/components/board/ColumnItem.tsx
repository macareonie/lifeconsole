import { useState } from "react";
import type { Card, Column } from "../../types/kanban";
import { CardItem } from "./CardItem";
import { Button } from "../ui/button";
import { useCardMutations } from "../../hooks/kanban/useCardMutations";
import { useColumnMutations } from "../../hooks/kanban/useColumnMutations";
import { CardCreateForm } from "./forms/CardCreateForm";
import { ColumnEditForm } from "./forms/ColumnEditForm";
import { DeleteConfirmButton } from "./forms/DeleteConfirmButton";
import type { JsonValue } from "../../types/json";

type CardFormValues = {
  title: string;
  subtitle: string;
  metadata: JsonValue;
};

type ColumnTitleFormValues = {
  title: string;
  position: number;
};

export function ColumnItem({
  column,
  boardId,
  onCardClick,
}: {
  column: Column;
  boardId: number;
  onCardClick?: (card: Card) => void;
}) {
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const { updateColumnMutation, deleteColumnMutation } = useColumnMutations();
  const { createCardMutation } = useCardMutations();
  const sortedCards = column.cards.sort(
    (a: Card, b: Card) => a.position - b.position,
  );

  const onUpdateColumn = async ({ title, position }: ColumnTitleFormValues) => {
    await updateColumnMutation.mutateAsync({
      columnId: column.id,
      boardId,
      title,
      position,
    });
    setIsEditingColumn(false);
  };

  const onDeleteColumn = async () => {
    await deleteColumnMutation.mutateAsync({ columnId: column.id, boardId });
  };

  const onCreateCard = async ({
    title,
    subtitle,
    metadata,
  }: CardFormValues) => {
    await createCardMutation.mutateAsync({
      boardId,
      title,
      subtitle,
      columnId: column.id,
      position: sortedCards.length + 1,
      metadata,
    });
    setIsCreatingCard(false);
  };

  return (
    <div className="w-80 shrink-0 rounded-2xl border border-border bg-muted/60 p-3 shadow-sm">
      <div className="mb-3 space-y-3 px-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
            {column.title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-border">
              {sortedCards.length}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsEditingColumn((value) => !value)}
            >
              {isEditingColumn ? "Close" : "Edit"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsCreatingCard((value) => !value)}
            >
              {isCreatingCard ? "Close" : "Add card"}
            </Button>
            <DeleteConfirmButton
              confirmMessage={`Delete column "${column.title}" and all cards inside it?`}
              label="Delete"
              pendingLabel="Deleting..."
              isPending={deleteColumnMutation.isPending}
              onConfirm={onDeleteColumn}
              size="xs"
            />
          </div>
        </div>

        {isEditingColumn && (
          <ColumnEditForm
            columnId={column.id}
            initialTitle={column.title}
            initialPosition={column.position}
            isPending={updateColumnMutation.isPending}
            errorMessage={
              updateColumnMutation.isError
                ? updateColumnMutation.error.message
                : undefined
            }
            onSubmit={onUpdateColumn}
            onCancel={() => setIsEditingColumn(false)}
          />
        )}

        {isCreatingCard && (
          <CardCreateForm
            columnId={column.id}
            isPending={createCardMutation.isPending}
            errorMessage={
              createCardMutation.isError
                ? createCardMutation.error.message
                : undefined
            }
            onSubmit={onCreateCard}
            onCancel={() => setIsCreatingCard(false)}
          />
        )}
      </div>

      <div className="space-y-3">
        {sortedCards.map((card: Card) => (
          <CardItem
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card)}
          />
        ))}
      </div>
    </div>
  );
}
