import { useForm } from "react-hook-form";

import { BoardList } from "../components/board/BoardList";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useBoardMutations } from "../hooks/kanban/useBoardMutations";
import { useBoards } from "../hooks/kanban/useBoards";

type BoardFormValues = {
  title: string;
};

const BoardListPage = () => {
  const { data, isPending, isError, error } = useBoards();
  const { createBoardMutation } = useBoardMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardFormValues>({
    defaultValues: { title: "" },
  });

  const onCreateBoard = async ({ title }: BoardFormValues) => {
    await createBoardMutation.mutateAsync(title);
    reset();
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Boards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new board to start organizing work.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onCreateBoard)}
          className="flex flex-col gap-3 md:flex-row md:items-end"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="board-title">Board title</Label>
            <Input
              id="board-title"
              placeholder="Roadmap, Sprint Planning, ..."
              {...register("title", { required: "Board title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={createBoardMutation.isPending}
            className="md:w-auto"
          >
            {createBoardMutation.isPending ? "Creating..." : "Create board"}
          </Button>
        </form>

        {createBoardMutation.isError && (
          <p className="text-sm text-destructive">
            {createBoardMutation.error.message}
          </p>
        )}
      </div>

      <div>
        {isPending && <div>Loading boards...</div>}
        {isError && <div>Error loading boards: {error.message}</div>}
        {!data || data.length === 0 ? (
          <div className="p-6 text-muted-foreground">
            No boards yet, time to create one!
          </div>
        ) : null}
        {data && data.length > 0 && <BoardList boards={data} />}
      </div>
    </div>
  );
};

export default BoardListPage;
