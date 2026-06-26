import { MoodPicker } from "./MoodPicker";
import { WeeklyMoodSection } from "./WeeklyMood";

export function MoodWidget({ weekAnchor }: { weekAnchor: Date }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Mood Tracking
      </h3>
      <MoodPicker />
      <div className="my-4 border-t border-border" />
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Mood this week
      </h3>
      <WeeklyMoodSection weekAnchor={weekAnchor} />
    </div>
  );
}
