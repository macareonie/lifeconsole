import { Link } from "react-router-dom";
import type { BoardSummary } from "../../types/kanban";

export function BoardListItem({ board }: { board: BoardSummary }) {
  return (
    <Link
      to={`/board/${board.id}`}
      className="relative flex min-h-45 flex-col justify-between
        rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm
        transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="absolute inset-y-0 left-0 w-3 rounded-l-xl bg-primary/25" />
      <div className="pl-3">
        <h2 className="text-lg font-semibold">{board.title}</h2>
      </div>
    </Link>
  );
}
