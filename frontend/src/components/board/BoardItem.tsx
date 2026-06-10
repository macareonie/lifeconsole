import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Card, Column, BoardContent } from "../../types/kanban";
import { Button } from "../ui/button";

import { ColumnItem } from "./ColumnItem";
import { CardDetailsModal } from "./CardDetailsModal";
import { useBoardMutations } from "../../hooks/kanban/useBoardMutations";
import { useColumnMutations } from "../../hooks/kanban/useColumnMutations";
import { BoardEditForm } from "./forms/BoardEditForm";
import { ColumnCreateForm } from "./forms/ColumnCreateForm";
import { DeleteConfirmButton } from "./forms/DeleteConfirmButton";

import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/react";
import { CardPreview } from "./CardPreview";

type BoardTitleFormValues = {
  title: string;
};

type ColumnFormValues = {
  title: string;
};

function toItemMap(columns: Column[]) {
  return Object.fromEntries(
    columns.map((column) => [String(column.id), column.cards]),
  );
}

function toColumnOrder(columns: Column[]) {
  return columns.map((column) => String(column.id));
}

export function BoardItem({ board }: { board: BoardContent }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const navigate = useNavigate();
  const { updateBoardMutation, updateLayoutMutation, deleteBoardMutation } =
    useBoardMutations();
  const { createColumnMutation } = useColumnMutations();

  const [items, setItems] = useState(() => toItemMap(board.columns));
  const [columnOrder, setColumnOrder] = useState(() =>
    toColumnOrder(board.columns),
  );

  const isDragging = useRef(false);
  const snapshot = useRef({ items, columnOrder });

  const boardStateRef = useRef({
    items: toItemMap(board.columns),
    columnOrder: toColumnOrder(board.columns),
  });
  useEffect(() => {
    boardStateRef.current = {
      items: toItemMap(board.columns),
      columnOrder: toColumnOrder(board.columns),
    };
    if (!isDragging.current) {
      setItems(boardStateRef.current.items);
      setColumnOrder(boardStateRef.current.columnOrder);
    }
  }, [board]);

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

  const handleDragStart = (event: DragStartEvent) => {
    isDragging.current = true;
    snapshot.current = { items, columnOrder };

    const { source } = event.operation;
    if (source?.type === "card") {
      // Find the card data across all columns so we can render it in the overlay
      const allCards = Object.values(items).flat();
      const card = allCards.find((c) => c.id === source.id) ?? null;
      setActiveCard(card);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    isDragging.current = false;
    setActiveCard(null);

    if (event.canceled) {
      setItems(snapshot.current.items);
      setColumnOrder(snapshot.current.columnOrder);
      return;
    }

    const { source, target } = event.operation;
    if (!source) return;

    if (source.type === "column") {
      if (!isSortable(source)) return;
      const { initialIndex, index } = source;

      setColumnOrder((currentOrder) => {
        const newOrder = [...currentOrder];
        const [moved] = newOrder.splice(initialIndex, 1);
        newOrder.splice(index, 0, moved);

        // newOrder is fresh here — no stale closure
        const layout = {
          columns: newOrder.map((col_id) => ({
            id: Number(col_id),
            card_ids: (items[col_id] ?? []).map((c) => c.id),
          })),
        };
        updateLayoutMutation.mutate(
          { board_id: board.id, layout },
          { onError: () => setColumnOrder(snapshot.current.columnOrder) },
        );
        return newOrder;
      });
      return;
    }

    // Card move (same column or cross-column)
    if (source.type === "card" && isSortable(source)) {
      const { initialGroup, initialIndex, index } = source;

      let group = source.group;

      if (
        target &&
        target.type === "column-drop" &&
        typeof target.id === "string"
      ) {
        // target.id is "column-drop-{column_id}" — extract the column id
        const targetColId = String(target.id).replace("column-drop-", "");
        if (targetColId) {
          group = targetColId;
        }
      }
      if (!initialGroup) {
        setItems(snapshot.current.items);
        return;
      }

      const knownColumnIds = new Set(columnOrder);
      if (!group || !knownColumnIds.has(group.toString())) {
        setItems(snapshot.current.items);
        return;
      }

      setItems((currentItems) => {
        let nextItems: typeof currentItems;

        if (initialGroup === group) {
          // Same column reorder
          const groupCards = [...(currentItems[initialGroup] ?? [])];
          const [moved] = groupCards.splice(initialIndex, 1);
          groupCards.splice(index, 0, moved);
          nextItems = { ...currentItems, [group]: groupCards };
        } else {
          // Cross-column transfer
          const sourceCards = [...(currentItems[initialGroup] ?? [])];
          const [moved] = sourceCards.splice(initialIndex, 1);
          const targetCards = [...(currentItems[group] ?? [])];

          const isEmpty = (currentItems[group]?.length ?? 0) === 0;
          const insertAt = isEmpty ? 0 : Math.min(index, targetCards.length);
          targetCards.splice(insertAt, 0, {
            ...moved,
            column_id: Number(group),
          });
          nextItems = {
            ...currentItems,
            [initialGroup]: sourceCards,
            [group]: targetCards,
          };
        }

        const layout = {
          columns: columnOrder.map((col_id) => ({
            id: Number(col_id),
            card_ids: (nextItems[col_id] ?? []).map((c) => c.id),
          })),
        };

        updateLayoutMutation.mutate(
          { board_id: board.id, layout },
          { onError: () => setItems(snapshot.current.items) },
        );

        return nextItems;
      });
    }
  };

  // Merge server column shape with optimistic card order from items
  const columns = columnOrder
    .map((col_id) => board.columns.find((c) => String(c.id) === col_id))
    .filter((col): col is Column => col !== undefined)
    .map((col) => ({ ...col, cards: items[String(col.id)] ?? [] }));

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
          onDragStart={handleDragStart}
          // onDragOver={handleDragOver}
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
            {activeCard ? (
              <div>
                <CardPreview card={activeCard} />
              </div>
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
