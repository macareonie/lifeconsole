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
    return (
      <div className="p-6 text-muted-foreground">
        No boards yet, time to create one!
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Your Boards</h1>
      <BoardList boards={data} />
    </div>
  );
};

export default BoardListPage;
