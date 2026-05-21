import { useParams } from "react-router-dom";
import { useBoardContent } from "../hooks/kanban/useBoardContent";
import { BoardItem } from "../components/board/BoardItem";

const BoardPage = () => {
  const { id } = useParams();
  const boardId = Number(id);
  const { data, isPending, isError, error } = useBoardContent(Number(boardId));

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
