import type { Card } from "../../types/kanban";

export function CardItem({ card }: { card: Card }) {
  return (
    <div className="bg-white rounded shadow p-2 mb-2">
      <strong>{card.title}</strong>
      {card.subtitle && (
        <p className="text-sm text-gray-500">{card.subtitle}</p>
      )}
      {card.metadata && (
        <div className="mt-2">
          {Object.entries(card.metadata).map(([field, description]) => (
            <p key={field} className="text-xs text-gray-400">
              {field}: {description}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
