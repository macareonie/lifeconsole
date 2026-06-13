import { useState } from "react";
import type { Card, Column } from "../../types/kanban";
import { CardItem, CardOverlayPreview } from "./CardItem";
import { Button } from "../ui/button";
import { useCardMutations } from "../../hooks/kanban/useCardMutations";
import { useColumnMutations } from "../../hooks/kanban/useColumnMutations";
import { CardCreateForm } from "./forms/CardCreateForm";
import { ColumnEditForm } from "./forms/ColumnEditForm";
import { DeleteConfirmButton } from "./forms/DeleteConfirmButton";
import type { JsonValue } from "../../types/json";
import { GripVertical } from "lucide-react";

import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";

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
  index,
  board_id,
  onCardClick,
}: {
  column: Column;
  index: number;
  board_id: number;
  onCardClick?: (card: Card) => void;
}) {
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const { updateColumnMutation, deleteColumnMutation } = useColumnMutations();
  const { createCardMutation } = useCardMutations();

  // Register under diff IDs for sortbale columns and for droppable column zones for CARDS only.
  // Collision priority higher for card zones when empty to prevent weird behaviours where cards can be dropped into column area.
  const {
    ref: columnRef,
    isDragging: isColumnDragging,
    isDropTarget: isColumnDropTarget,
    handleRef,
  } = useSortable({
    id: column.id,
    index,
    type: "column",
    accept: ["column"],
    collisionPriority: CollisionPriority.Low,
  });

  const { ref: cardZoneRef, isDropTarget: isCardZoneTarget } = useDroppable({
    id: `zone-${column.id}`,
    type: "column",
    accept: "card",
    collisionPriority:
      column.cards.length === 0
        ? CollisionPriority.Normal
        : CollisionPriority.Low,
  });

  const onUpdateColumn = async ({ title, position }: ColumnTitleFormValues) => {
    await updateColumnMutation.mutateAsync({
      column_id: column.id,
      board_id,
      title,
      position,
    });
    setIsEditingColumn(false);
  };

  const onDeleteColumn = async () => {
    await deleteColumnMutation.mutateAsync({ column_id: column.id, board_id });
  };

  const onCreateCard = async ({
    title,
    subtitle,
    metadata,
  }: CardFormValues) => {
    await createCardMutation.mutateAsync({
      board_id,
      title,
      subtitle,
      column_id: column.id,
      position: column.cards.length,
      metadata,
    });
    setIsCreatingCard(false);
  };

  return (
    <div
      ref={columnRef}
      className={`Column w-80 shrink-0 rounded-2xl border bg-muted/60 p-3 shadow-sm transition-all duration-150
        ${isColumnDragging ? "opacity-0" : "opacity-100"}
        ${isColumnDropTarget ? "border-primary/60 shadow-md" : "border-border"}
      `}
    >
      <div className="mb-3 space-y-3 px-1">
        <div className="flex items-center justify-between gap-3">
          {/* Drag handle — only this triggers column drag */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              ref={handleRef}
              className="self-stretch cursor-grab touch-none rounded p-0.5 text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
            >
              <GripVertical />
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
              {column.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-border">
              {column.cards.length}
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
            column_id={column.id}
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
            column_id={column.id}
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

      {/* Card drop zone */}
      <div
        ref={cardZoneRef}
        className={`min-h-128 space-y-3 rounded-xl border-2 border-dashed p-1 transition-colors duration-150
          ${
            isCardZoneTarget
              ? "border-primary/40 bg-primary/5"
              : "border-transparent"
          }
        `}
      >
        {column.cards.map((card: Card, index: number) => (
          <CardItem
            key={card.id}
            card={card}
            index={index}
            column_id={column.id}
            onClick={() => onCardClick?.(card)}
          />
        ))}
      </div>
    </div>
  );
}

// Same as cardoverlay preview. static rendering simply for the dragoverlay.
export function ColumnOverlayPreview({ column }: { column: Column }) {
  return (
    <div className="w-80 rotate-1 rounded-2xl border border-primary/40 bg-muted/60 p-3 shadow-2xl ring-2 ring-primary/20 opacity-95">
      <div className="mb-3 space-y-3 px-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="cursor-grab self-stretch p-0.5 text-muted-foreground/50">
              <GripVertical />
            </div>
            <h2 className="truncate text-sm font-semibold uppercase tracking-wide text-foreground/80">
              {column.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-border">
              {column.cards.length}
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-128 space-y-3 rounded-xl border-2 border-dashed border-transparent p-1">
        {column.cards.map((card) => (
          <CardOverlayPreview card={card} />
        ))}
      </div>
    </div>
  );
}
