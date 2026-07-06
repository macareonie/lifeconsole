import type { Card } from "../../types/kanban";

export function CardPreview({ card }: { card: Card }) {
  return (
    <div className="w-full max-w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
      <h3>{card.title}</h3>
    </div>
  );
}
