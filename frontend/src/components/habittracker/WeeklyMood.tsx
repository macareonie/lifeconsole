import { useMoodLogsByWeek } from "@/hooks/habittracker/useMoodLog";
import {
  formatDayLabel,
  getWeekDays,
  toIsoDate,
} from "@/utils/habittracker/datetimeHelpers";

import { MOOD_SCALE } from "../../types/habittracker";

export function WeeklyMoodSection({ weekAnchor }: { weekAnchor: Date }) {
  const { data: moodLogs, isLoading } = useMoodLogsByWeek(weekAnchor);
  const weekDays = getWeekDays(weekAnchor);

  // Map mood value -> bar height. MOOD_SCALE is 1-5, so this normalizes
  // to a 0-100% range for the bar chart.
  const moodByDate = new Map(
    (moodLogs ?? []).map((log) => [toIsoDate(new Date(log.date)), log.mood]),
  );

  if (isLoading) {
    return (
      <p className="text-xs text-muted-foreground">Loading mood data...</p>
    );
  }

  const loggedMoods = weekDays
    .map((day) => moodByDate.get(toIsoDate(day)))
    .filter((mood): mood is number => !!mood);

  if (loggedMoods.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No mood entries logged this week yet.
      </p>
    );
  }

  const averageMood =
    loggedMoods.reduce((sum, mood) => sum + mood, 0) / loggedMoods.length;
  const averageMoodOption = MOOD_SCALE.find(
    (m) => m.value === Math.round(averageMood),
  );

  const yAxisLevels = [...MOOD_SCALE].reverse();

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-xs text-muted-foreground">This week</p>
        <p className="text-xs font-medium text-foreground">
          Average: {averageMood.toFixed(1)} {averageMoodOption?.emoji}
        </p>
      </div>

      <div className="flex gap-2">
        {/* Y-axis column */}
        <div className="flex h-24 flex-col justify-between text-xs text-muted-foreground">
          {yAxisLevels.map((level) => (
            <span key={level.value} title={level.label}>
              {level.emoji}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 items-end justify-between gap-1.5 border-l border-border pl-2">
          {weekDays.map((day) => {
            const iso = toIsoDate(day);
            const mood = moodByDate.get(iso);
            const { weekday } = formatDayLabel(day);
            const heightPct = mood ? (mood / 5) * 100 : 0;
            const moodOption = MOOD_SCALE.find((m) => m.value === mood);

            return (
              <div
                key={iso}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-24 w-full items-end">
                  <div
                    className={`w-full rounded-md transition-all ${
                      mood ? "bg-primary/70" : "bg-muted"
                    }`}
                    style={{ height: mood ? `${heightPct}%` : "4px" }}
                    title={moodOption?.label ?? "No entry"}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {weekday}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
