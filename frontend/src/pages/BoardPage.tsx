import { useParams } from "react-router-dom";

import { BoardItem } from "../components/kanban/BoardItem";
import { useBoardContent } from "../hooks/kanban/useBoardContent";

const BoardPage = () => {
  const { id } = useParams();
  const boardId = Number(id);
  const { data, isPending, isError, error } = useBoardContent(boardId);

  if (!id || !Number.isFinite(boardId)) {
    return <div>Invalid Board ID</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div className="p-6 text-muted-foreground">Board not found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <BoardItem board={data} />
    </div>
  );
};

export default BoardPage;
