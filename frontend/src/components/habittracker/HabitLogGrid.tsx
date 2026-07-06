import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useHabitMutations } from "../../hooks/habittracker/useHabitMutations";
import {
  addWeeks,
  formatDayLabel,
  formatWeekRangeLabel,
  getWeekDays,
  isSameDay,
  toIsoDate,
} from "../../utils/habittracker/datetimeHelpers";
import { DeleteConfirmButton } from "../DeleteConfirmButton";
import { HabitLogCheckbox } from "./HabitLogCheckbox";
import { StreakBadge } from "./StreakBadge";

import type { Habit, HabitLog } from "../../types/habittracker";

export function HabitLogGrid({
  habits,
  logsByHabit,
  weekAnchor,
  onWeekChange,
}: {
  habits: Habit[];
  logsByHabit: Map<number, Map<string, HabitLog>>;
  weekAnchor: Date;
  onWeekChange: (next: Date) => void;
}) {
  const { deleteHabitMutation } = useHabitMutations();
  const weekDays = getWeekDays(weekAnchor);
  const today = new Date();

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-sm">
      {/* Week navigation header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(addWeeks(weekAnchor, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold text-foreground">
          {formatWeekRangeLabel(weekDays[0])}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(addWeeks(weekAnchor, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day-of-week header row */}
      <div className="grid grid-cols-[1fr_repeat(7,2.5rem)] items-center gap-4 border-b border-border px-4 py-2 sm:grid-cols-[16rem_repeat(7,2.5rem)]">
        <div />
        {weekDays.map((day) => {
          const { weekday, day: dayNum } = formatDayLabel(day);
          const isToday = isSameDay(day, today);
          return (
            <div
              key={toIsoDate(day)}
              className={`flex flex-col items-center text-xs ${
                isToday ? "font-semibold text-primary" : "text-muted-foreground"
              }`}
            >
              <span>{weekday}</span>
              <span>{dayNum}</span>
            </div>
          );
        })}
      </div>

      {/* Habit rows */}
      <div className="divide-y divide-border">
        {habits.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No habits yet. Add one to start tracking.
          </p>
        )}

        {habits.map((habit) => {
          const habitLogs = logsByHabit.get(habit.id) ?? new Map();
          return (
            <div
              key={habit.id}
              className="grid grid-cols-[1fr_repeat(7,2.5rem)] items-center gap-4 px-4 py-3 sm:grid-cols-[16rem_repeat(7,2.5rem)]"
            >
              <div className="flex items-center justify-between gap-2 pr-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {habit.title}
                  </p>
                </div>
                <StreakBadge habit={habit} />
                <DeleteConfirmButton
                  confirmMessage={`Delete habit "${habit.title}" and all of its logs?`}
                  label="Delete"
                  pendingLabel="Deleting..."
                  isPending={deleteHabitMutation.isPending}
                  onConfirm={() => deleteHabitMutation.mutateAsync(habit.id)}
                  size="xs"
                />
              </div>

              {weekDays.map((day) => {
                const iso = toIsoDate(day);
                return (
                  <div key={iso} className="flex justify-center">
                    <HabitLogCheckbox
                      habit={habit}
                      date={iso}
                      existingLog={habitLogs.get(iso)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
