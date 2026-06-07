import type { Card } from "../../types/kanban";

export function CardItem({
  card,
  onClick,
}: {
  card: Card;
  onClick?: (card: Card) => void;
}) {
  const metadataEntries =
    card.metadata &&
    typeof card.metadata === "object" &&
    !Array.isArray(card.metadata)
      ? Object.entries(card.metadata)
      : [];
  const previewEntries = metadataEntries.slice(0, 3);
  const remainingCount = metadataEntries.length - previewEntries.length;

  return (
    <button
      type="button"
      name={card.title}
      onClick={() => onClick?.(card)}
      className="w-full rounded-xl border border-border bg-card p-4 text-left text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
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
    </button>
  );
}
