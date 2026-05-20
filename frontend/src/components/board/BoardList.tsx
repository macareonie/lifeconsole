import type { BoardSummary } from "../../types/kanban";
import { BoardListItem } from "./BoardListItem";

export function BoardList({ boards }: { boards: BoardSummary[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Object.values(boards).map((board) => (
        <BoardListItem key={board.id} board={board} />
      ))}
    </div>
  );
}
