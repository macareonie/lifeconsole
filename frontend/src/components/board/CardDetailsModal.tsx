import type { Card } from "../../types/kanban";

export function CardDetailsModal({
  card,
  onClose,
}: {
  card: Card;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{card.title}</h2>
            {card.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {card.subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Close
          </button>
        </div>

        {card.metadata && (
          <div className="space-y-2">
            {Object.entries(card.metadata).map(([field, value]) => (
              <div key={field} className="rounded-lg bg-muted p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {field}
                </p>
                <p className="mt-1 text-sm text-foreground">{String(value)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
