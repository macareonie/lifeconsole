import type { Column, BoardContent } from "../../types/kanban";
import { ColumnItem } from "./ColumnItem";

export function BoardItem({ board }: { board: BoardContent }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
      <div className="flex space-x-4 overflow-x-auto border-2 border-gray-300 rounded-lg p-4">
        {board.columns
          .sort((a: Column, b: Column) => a.position - b.position)
          .map((column: Column) => (
            <ColumnItem key={column.id} column={column} />
          ))}
      </div>
    </div>
  );
}
