import { useState } from "react";

import { HabitCreateForm } from "../components/habittracker/forms/HabitCreateForm";
import { HabitLogGrid } from "../components/habittracker/HabitLogGrid";
import { Button } from "../components/ui/button";
import { useHabitLogs } from "../hooks/habittracker/useHabitLogs";
import { useHabitMutations } from "../hooks/habittracker/useHabitMutations";
import { useHabits } from "../hooks/habittracker/useHabits";

const HabitTrackerPage = () => {
  const { data: habits, isPending, isError, error } = useHabits();
  const { logsByHabit, isPending: logsPending } = useHabitLogs(habits);
  const { createHabitMutation } = useHabitMutations();

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());

  const onCreateHabit = async ({
    title,
    frequency,
  }: {
    title: string;
    frequency: string;
  }) => {
    await createHabitMutation.mutateAsync({ title, frequency });
    setIsAddingHabit(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-sm text-muted-foreground">
            {habits?.length ?? 0} habits tracked
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddingHabit((v) => !v)}
        >
          {isAddingHabit ? "Close" : "Add habit"}
        </Button>
      </div>

      {isAddingHabit && (
        <div className="mb-6">
          <HabitCreateForm
            isPending={createHabitMutation.isPending}
            errorMessage={
              createHabitMutation.isError
                ? createHabitMutation.error.message
                : undefined
            }
            onSubmit={onCreateHabit}
            onCancel={() => setIsAddingHabit(false)}
          />
        </div>
      )}

      {isPending && (
        <p className="text-sm text-muted-foreground">Loading habits...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">Error: {error.message}</p>
      )}

      {habits && (
        <HabitLogGrid
          habits={habits}
          logsByHabit={logsByHabit}
          weekAnchor={weekAnchor}
          onWeekChange={setWeekAnchor}
        />
      )}

      {logsPending && (
        <p className="mt-2 text-xs text-muted-foreground">Loading logs...</p>
      )}
    </div>
  );
};

export default HabitTrackerPage;
