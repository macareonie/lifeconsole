import { Link } from "react-router-dom";
import type { BoardSummary } from "../../types/kanban";

export function BoardListItem({ board }: { board: BoardSummary }) {
  return (
    <Link
      to={`/board/${board.id}`}
      className="relative flex min-h-45 flex-col justify-between
        rounded-xl border border-gray-200 bg-white p-5 shadow-sm
        transition hover:-translate-y-0.5 hover:shadow-md
        dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-xl bg-amber-300 dark:bg-amber-600" />
      <div className="pl-3">
        <h2 className="text-lg font-semibold">{board.title}</h2>
      </div>
    </Link>
  );
}
