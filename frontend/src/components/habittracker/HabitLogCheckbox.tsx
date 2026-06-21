import { Check } from "lucide-react";
import { useState } from "react";

import { useHabitLogMutations } from "../../hooks/habittracker/useHabitLogMutations";

import type { Habit } from "../../types/habittracker";
export function HabitLogCheckbox({
  habit,
  date,
}: {
  habit: Habit;
  date: string;
}) {
  const { toggleHabitLogMutation } = useHabitLogMutations();

  const [isCompleted, setIsCompleted] = useState<boolean | undefined>(false);

  const onToggle = () => {
    toggleHabitLogMutation.mutate({
      habit_id: habit.id,
      date,
    });
    setIsCompleted((prev) => !prev);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isCompleted}
      aria-label={`${habit.title} on ${date}`}
      onClick={onToggle}
      disabled={toggleHabitLogMutation.isPending}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors
        ${
          isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background hover:border-primary/40 hover:bg-muted"
        }
        ${toggleHabitLogMutation.isPending ? "opacity-50" : ""}
      `}
    >
      {isCompleted && <Check className="h-4 w-4" />}
    </button>
  );
}
