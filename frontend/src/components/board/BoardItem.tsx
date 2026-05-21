import { useState } from "react";
import type { Card, Column, BoardContent } from "../../types/kanban";
import { ColumnItem } from "./ColumnItem";
import { CardDetailsModal } from "./CardDetailsModal";

export function BoardItem({ board }: { board: BoardContent }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{board.title}</h1>
        <p className="text-sm text-muted-foreground">
          {board.columns.length} columns
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.columns
          .sort((a: Column, b: Column) => a.position - b.position)
          .map((column: Column) => (
            <ColumnItem
              key={column.id}
              column={column}
              onCardClick={setSelectedCard}
            />
          ))}
      </div>

      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
