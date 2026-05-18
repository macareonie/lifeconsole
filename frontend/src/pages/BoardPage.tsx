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
    return <div>Board not found</div>;
  }

  return (
    <div>
      <h2> board item </h2>
      <BoardItem board={data} />
    </div>
  );
};

export default BoardPage;
