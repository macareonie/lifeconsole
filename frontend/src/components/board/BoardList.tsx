import type { BoardSummary } from "../../types/kanban";
import { BoardListItem } from "./BoardListItem";

export function BoardList({ boards }: { boards: BoardSummary[] }) {
  return (
    <div className="space-y-4">
      {boards.map((board) => (
        <BoardListItem key={board.id} board={board} />
      ))}
    </div>
  );
}
