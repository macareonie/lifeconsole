import type { Card, Column } from "../../types/kanban";
import { CardItem } from "./CardItem";

export function ColumnItem({ column }: { column: Column }) {
  return (
    <div className="bg-gray-100 rounded p-2 w-64 border-2 border-gray-300">
      <h2 className="font-bold mb-2">{column.title}</h2>
      {column.cards
        .sort((a: Card, b: Card) => a.position - b.position)
        .map((card: Card) => (
          <CardItem key={card.id} card={card} />
        ))}
    </div>
  );
}
