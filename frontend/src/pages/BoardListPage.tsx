import { BoardList } from "../components/board/BoardList";
import { useBoards } from "../hooks/kanban/useBoards";

const BoardListPage = () => {
  const { data, isPending, isError, error } = useBoards();
  if (isPending) {
    return <div>Loading boards...</div>;
  }
  if (isError) {
    return <div>Error loading boards: {error.message}</div>;
  }
  if (!data || data.length === 0) {
    return <div>No boards yet, time to create one!</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Your Boards
      </h1>
      <BoardList boards={data} />
    </div>
  );
};

export default BoardListPage;
