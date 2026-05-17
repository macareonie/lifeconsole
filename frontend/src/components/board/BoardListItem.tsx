import { Link } from "react-router-dom";
import type { BoardSummary } from "../../types/kanban";

export function BoardListItem({ board }: { board: BoardSummary }) {
  return (
    <Link
      to={`/board/${board.id}`}
      className="block p-4 border rounded hover:bg-gray-100"
    >
      <div className="text-lg font-semibold">{board.title}</div>
    </Link>
  );
}
