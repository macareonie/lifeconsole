import type { Card, Column } from "../../types/kanban";
import { CardItem } from "./CardItem";

export function ColumnItem({
  column,
  onCardClick,
}: {
  column: Column;
  onCardClick?: (card: Card) => void;
}) {
  const sortedCards = column.cards.sort(
    (a: Card, b: Card) => a.position - b.position,
  );

  return (
    <div className="w-80 shrink-0 rounded-2xl border border-border bg-muted/60 p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
          {column.title}
        </h2>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-border">
          {sortedCards.length}
        </span>
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
