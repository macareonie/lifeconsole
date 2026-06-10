import { useState } from "react";
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

type BoardTitleFormValues = {
  title: string;
};

type ColumnFormValues = {
  title: string;
};

export function BoardItem({ board }: { board: BoardContent }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const navigate = useNavigate();
  const { updateBoardMutation, deleteBoardMutation } = useBoardMutations();
  const { createColumnMutation } = useColumnMutations();

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
      position: board.columns.length + 1,
    });
    setIsAddingColumn(false);
  };

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
        {board.columns
          .sort((a: Column, b: Column) => a.position - b.position)
          .map((column: Column) => (
            <ColumnItem
              key={column.id}
              column={column}
              board_id={board.id}
              onCardClick={setSelectedCard}
            />
          ))}
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
