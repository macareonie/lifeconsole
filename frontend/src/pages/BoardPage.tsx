import { useParams } from "react-router-dom";
import { useBoardContent } from "../hooks/kanban/useBoardContent";
import { BoardItem } from "../components/board/BoardItem";

const BoardPage = () => {
  const { boardId } = useParams();
  const { data, isPending, isError, error } = useBoardContent(Number(boardId));

  if (!boardId || !Number.isFinite(boardId)) {
    return <div>Invalid Board ID</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Board not found</div>;
  }

  return <BoardItem board={data} />;
};

export default BoardPage;
