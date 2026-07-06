import { useState } from "react";

import { HabitCreateForm } from "../components/habittracker/forms/HabitCreateForm";
import { HabitLogGrid } from "../components/habittracker/HabitLogGrid";
import { MoodWidget } from "../components/habittracker/Moodwidget";
import { StatsDashboard } from "../components/habittracker/StatsDashBoard";
import { Button } from "../components/ui/button";
import { useHabitLogs } from "../hooks/habittracker/useHabitLogs";
import { useHabitMutations } from "../hooks/habittracker/useHabitMutations";
import { useHabits } from "../hooks/habittracker/useHabits";

const HabitTrackerPage = () => {
  const { data: habits, isPending, isError, error } = useHabits();
  const { createHabitMutation } = useHabitMutations();

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());

  const { logsByHabit, isPending: logsPending } = useHabitLogs(weekAnchor);

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
        <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-[50fr_20fr_30fr]">
          <div className="space-y-2">
            <HabitLogGrid
              habits={habits}
              logsByHabit={logsByHabit}
              weekAnchor={weekAnchor}
              onWeekChange={setWeekAnchor}
            />
            {logsPending && (
              <p className="text-xs text-muted-foreground">Loading logs...</p>
            )}
          </div>

          <div className="grid gap-4">
            <MoodWidget weekAnchor={weekAnchor} />
          </div>

          <div>
            <StatsDashboard habits={habits} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTrackerPage;
