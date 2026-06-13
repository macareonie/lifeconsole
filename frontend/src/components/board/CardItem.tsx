import type { Card } from "../../types/kanban";
import { GripVertical } from "lucide-react";

import { useSortable } from "@dnd-kit/react/sortable";

function CardContent({ card }: { card: Card }) {
  const metadataEntries =
    card.metadata &&
    typeof card.metadata === "object" &&
    !Array.isArray(card.metadata)
      ? Object.entries(card.metadata)
      : [];
  const previewEntries = metadataEntries.slice(0, 3);
  const remainingCount = metadataEntries.length - previewEntries.length;

  return (
    <>
      <h3 className="text-sm font-semibold">{card.title}</h3>

      {card.subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{card.subtitle}</p>
      )}

      {previewEntries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {previewEntries.map(([field, description]) => (
            <span
              key={field}
              className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {field}: {String(description)}
            </span>
          ))}

          {remainingCount > 0 && (
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              +{remainingCount} more
            </span>
          )}
        </div>
      )}
    </>
  );
}

export function CardItem({
  card,
  index,
  column_id,
  onClick,
}: {
  card: Card;
  index: number;
  column_id: number;
  onClick?: (card: Card) => void;
}) {
  const { ref, isDragging, isDropTarget, handleRef } = useSortable({
    id: card.id,
    index,
    type: "card",
    accept: "card",
    // group must be a string to match the keys of cardsByColumn
    // (Record<string, Card[]>) in BoardItem — used to find/transfer
    // the card between groups in handleDragEnd.
    group: String(column_id),
  });

  return (
    <div ref={ref} className="relative">
      {/* Drop indicator line above the card */}
      <div
        className={`absolute -top-1.5 left-2 right-2 h-0.5 rounded-full bg-primary transition-opacity duration-100 ${
          isDropTarget ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`group flex w-full items-start gap-1 rounded-xl border bg-card text-card-foreground shadow-sm transition-all
          ${isDragging ? "opacity-0" : "opacity-100"}
          ${isDropTarget ? "border-primary/60" : "border-border"}
        `}
      >
        {/* Grip handle — only this initiates drag */}
        <div
          ref={handleRef}
          className="cursor-grab touch-none rounded p-0.5 text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing self-center"
        >
          <GripVertical />
        </div>

        {/* Clickable card content */}
        <button
          type="button"
          name={card.title}
          onClick={() => onClick?.(card)}
          className="min-w-0 flex-1 py-4 pr-4 text-left hover:outline-none"
        >
          <CardContent card={card} />
        </button>
      </div>
    </div>
  );
}

// Static visual-only rendering for use inside <DragOverlay>
// prevent collision of ids/DOM element nodes with the actual rendered card
export function CardOverlayPreview({ card }: { card: Card }) {
  return (
    <div className="flex w-full items-start gap-1 rounded-xl border border-primary/40 bg-card text-card-foreground shadow-2xl ring-2 ring-primary/20 rotate-1">
      <div className="cursor-grab self-center p-0.5 text-muted-foreground/50">
        <GripVertical />
      </div>
      <div className="min-w-0 flex-1 py-4 pr-4">
        <CardContent card={card} />
      </div>
    </div>
  );
}
