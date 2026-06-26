import type { Habit } from "@/types/habittracker";
import { AllTimeSection } from "./AllTimeSection";

export function StatsDashboard({ habits }: { habits: Habit[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-foreground">All-time</h3>
      <AllTimeSection habits={habits} />
    </div>
  );
}
