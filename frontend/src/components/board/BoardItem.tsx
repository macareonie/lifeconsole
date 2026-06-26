import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PointerActivationConstraints, PointerSensor } from "@dnd-kit/dom";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import { useBoardMutations } from "../../hooks/kanban/useBoardMutations";
import { useColumnMutations } from "../../hooks/kanban/useColumnMutations";
import { DeleteConfirmButton } from "../DeleteConfirmButton";
import { Button } from "../ui/button";
import { CardDetailsModal } from "./CardDetailsModal";
import { CardOverlayPreview } from "./CardItem";
import { ColumnItem, ColumnOverlayPreview } from "./ColumnItem";
import { BoardEditForm } from "./forms/BoardEditForm";
import { ColumnCreateForm } from "./forms/ColumnCreateForm";

import type { Card, Column, BoardContent } from "../../types/kanban";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/react";
type BoardTitleFormValues = {
  title: string;
};

type ColumnFormValues = {
  title: string;
};

// helper functions to convert current data struc to match shape used in dnd-kit example guide
function toColumnOrder(columns: Column[]) {
  return columns.map((column) => column.id);
}

// cardsByColumn: Record<groupKey, Card[]>, keyed by column id as a string
// to match the `group` value used in CardItem's useSortable.
function toCardsByColumn(columns: Column[]) {
  return Object.fromEntries(
    columns.map((column) => [String(column.id), column.cards]),
  );
}

export function BoardItem({ board }: { board: BoardContent }) {
  const navigate = useNavigate();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const { updateBoardMutation, updateLayoutMutation, deleteBoardMutation } =
    useBoardMutations();
  const { createColumnMutation } = useColumnMutations();

  // local state; single source of truth that updates after each drag action
  const [columnOrder, setColumnOrder] = useState<number[]>(() =>
    toColumnOrder(board.columns),
  );
  const [cardsByColumn, setCardsByColumn] = useState<Record<string, Card[]>>(
    () => toCardsByColumn(board.columns),
  );
  // handle dragging state + dragOverlay, tracked by id instead of card or column objet
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<number | null>(null);

  const activeCard = activeCardId
    ? (Object.values(cardsByColumn)
        .flat()
        .find((card) => card.id === activeCardId) ?? null)
    : null;

  const activeColumn = activeColumnId
    ? (board.columns.find((col) => col.id === activeColumnId) ?? null)
    : null;

  const isDragging = useRef(false);

  // holds latest updated board layout state at any given time that does not change upon rerenders; used as fallback on dragevent errors
  const columnOrderRef = useRef(columnOrder);
  const cardsByColumnRef = useRef(cardsByColumn);

  useEffect(() => {
    if (!isDragging.current) {
      const nextOrder = toColumnOrder(board.columns);
      const nextCards = toCardsByColumn(board.columns);
      columnOrderRef.current = nextOrder;
      cardsByColumnRef.current = nextCards;
      // eslint-disable-next-line
      setColumnOrder(nextOrder);
      setCardsByColumn(nextCards);
    }
    // whenever the api put request goes through board layout is updated on the backend
    // and data is refetched, update local state if not currently in dragEvent
  }, [board.columns]);

  const onUpdateBoard = async ({ title }: BoardTitleFormValues) => {
    await updateBoardMutation.mutateAsync({ board_id: board.id, title });
    setIsEditingBoard(false);
  };

  const onDeleteBoard = async () => {
    await deleteBoardMutation.mutateAsync(board.id);
    navigate("/board");
  };

  const onCreateColumn = async ({ title }: ColumnFormValues) => {
    await createColumnMutation.mutateAsync({
      board_id: board.id,
      title,
      position: board.columns.length,
    });
    setIsAddingColumn(false);
  };

  const persistLayout = (
    nextColumnOrder: number[],
    nextCardsByColumn: Record<string, Card[]>,
  ) => {
    const layout = {
      columns: nextColumnOrder.map((col_id) => ({
        id: col_id,
        card_ids: (nextCardsByColumn[String(col_id)] ?? []).map((c) => c.id),
      })),
    };

    updateLayoutMutation.mutate(
      { board_id: board.id, layout },
      {
        onError: () => {
          // Roll back to last known-good state on error
          const fallbackOrder = toColumnOrder(board.columns);
          const fallbackCards = toCardsByColumn(board.columns);
          columnOrderRef.current = fallbackOrder;
          cardsByColumnRef.current = fallbackCards;
          setColumnOrder(fallbackOrder);
          setCardsByColumn(fallbackCards);
        },
      },
    );
  };

  // start tracking card/column in motion
  const handleDragStart = (event: DragStartEvent) => {
    isDragging.current = true;
    const { source } = event.operation;
    if (source?.type === "card") {
      setActiveCardId(source.id as number);
    }
    if (source?.type === "column") {
      setActiveColumnId(source.id as number);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { source, target } = event.operation;
    if (!source || !target) return;
    if (source.type !== "card") return;
    if (!isSortable(source)) return;

    const sourceGroup = String(source.group);
    if (!sourceGroup) return;

    // Determine target group and index
    let targetGroup: string;
    let targetIndex: number;

    if (target.type === "card" && isSortable(target)) {
      if (!target.group) return;
      targetGroup = String(target.group);
      targetIndex = target.index;
    } else if (target.type === "column") {
      const rawId = String(target.id).replace("zone-", "");
      targetGroup = rawId;
      targetIndex = (cardsByColumnRef.current[targetGroup] ?? []).length;
    } else {
      return;
    }

    const knownIds = new Set(columnOrderRef.current.map(String));
    if (!knownIds.has(sourceGroup) || !knownIds.has(targetGroup)) return;

    // No-op if nothing changed
    if (sourceGroup === targetGroup && source.index === targetIndex) return;

    setCardsByColumn((prev) => {
      const sourceCards = [...(prev[sourceGroup] ?? [])];
      const cardIdx = sourceCards.findIndex((c) => c.id === source.id);
      if (cardIdx === -1) return prev;

      const [moved] = sourceCards.splice(cardIdx, 1);

      if (sourceGroup === targetGroup) {
        // Same column reorder
        const insertAt = Math.min(targetIndex, sourceCards.length);
        sourceCards.splice(insertAt, 0, moved);
        const next = { ...prev, [sourceGroup]: sourceCards };
        cardsByColumnRef.current = next;
        return next;
      } else {
        // Cross-column transfer
        const targetCards = [...(prev[targetGroup] ?? [])];
        const insertAt = Math.min(targetIndex, targetCards.length);
        targetCards.splice(insertAt, 0, {
          ...moved,
          column_id: Number(targetGroup),
        });
        const next = {
          ...prev,
          [sourceGroup]: sourceCards,
          [targetGroup]: targetCards,
        };
        cardsByColumnRef.current = next;
        return next;
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    isDragging.current = false;
    setActiveCardId(null);
    setActiveColumnId(null);

    // Canceled — roll back to server state
    if (event.canceled) {
      const fallbackOrder = toColumnOrder(board.columns);
      const fallbackCards = toCardsByColumn(board.columns);
      columnOrderRef.current = fallbackOrder;
      cardsByColumnRef.current = fallbackCards;
      setColumnOrder(fallbackOrder);
      setCardsByColumn(fallbackCards);
      return;
    }

    const { source } = event.operation;
    if (!source) return;

    // Column reorder — only columns are handled in onDragEnd
    if (source.type === "column") {
      if (!isSortable(source)) return;
      const { initialIndex, index } = source;
      if (initialIndex === index) return;

      const newOrder = [...columnOrderRef.current];
      const [moved] = newOrder.splice(initialIndex, 1);
      newOrder.splice(index, 0, moved);

      columnOrderRef.current = newOrder;
      setColumnOrder(newOrder);
      persistLayout(newOrder, cardsByColumnRef.current);
      return;
    }

    // Card drop — state already correct from onDragOver, just persist
    if (source.type === "card") {
      persistLayout(columnOrderRef.current, cardsByColumnRef.current);
    }
  };

  // Merge server column shape (title, position, etc.) with the live
  // ordering/cards from local state.
  const columns = columnOrder
    .map((col_id) => board.columns.find((c) => c.id === col_id))
    .filter((col): col is Column => col !== undefined)
    .map((col) => ({
      ...col,
      cards: cardsByColumn[String(col.id)] ?? [],
    }));

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{board.title}</h1>
            <p className="text-sm text-muted-foreground">
              {board.columns.length} columns
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditingBoard((value) => !value)}
            >
              {isEditingBoard ? "Close edit" : "Edit board"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingColumn((value) => !value)}
            >
              {isAddingColumn ? "Close column form" : "Add column"}
            </Button>
            <DeleteConfirmButton
              confirmMessage={`Delete board "${board.title}" and all of its content?`}
              label="Delete board"
              pendingLabel="Deleting..."
              isPending={deleteBoardMutation.isPending}
              onConfirm={onDeleteBoard}
              size="sm"
            />
          </div>
        </div>

        {(isEditingBoard || isAddingColumn) && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {isEditingBoard && (
              <BoardEditForm
                initialTitle={board.title}
                isPending={updateBoardMutation.isPending}
                errorMessage={
                  updateBoardMutation.isError
                    ? updateBoardMutation.error.message
                    : undefined
                }
                onSubmit={onUpdateBoard}
                onCancel={() => setIsEditingBoard(false)}
              />
            )}

            {isAddingColumn && (
              <ColumnCreateForm
                isPending={createColumnMutation.isPending}
                errorMessage={
                  createColumnMutation.isError
                    ? createColumnMutation.error.message
                    : undefined
                }
                onSubmit={onCreateColumn}
                onCancel={() => setIsAddingColumn(false)}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        <DragDropProvider
          sensors={(defaults) => [
            ...defaults.filter((sensor) => sensor !== PointerSensor),
            PointerSensor.configure({
              activationConstraints: [
                // Drag starts after the pointer moves 8px
                new PointerActivationConstraints.Distance({ value: 8 }),
                // ...or after holding for 200ms with up to 10px tolerance
                new PointerActivationConstraints.Delay({
                  value: 200,
                  tolerance: 10,
                }),
              ],
            }),
          ]}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {columns.map((column: Column, index: number) => (
            <ColumnItem
              key={column.id}
              index={index}
              column={column}
              board_id={board.id}
              onCardClick={setSelectedCard}
            />
          ))}
          <DragOverlay>
            {activeCard ? <CardOverlayPreview card={activeCard} /> : null}
            {activeColumn ? (
              <ColumnOverlayPreview column={activeColumn} />
            ) : null}
          </DragOverlay>
        </DragDropProvider>
      </div>

      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          board_id={board.id}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
