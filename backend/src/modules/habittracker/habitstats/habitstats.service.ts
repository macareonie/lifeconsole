import { ServiceError } from "../../../errors/service.error.js";
import { getAllTimeCompletions } from "../../../repositories/habittracker/habitlog.repository.js";
import { resolveUserId } from "../../../utils/email-to-userId.js";

type AlltimeCompletionRow = {
  habitId: number;
  habits: { title: string };
};

type HabitCompletionCount = {
  habitId: number;
  title: string;
  completionCount: number;
};

function aggregateCompletions(
  rows: AlltimeCompletionRow[],
): HabitCompletionCount[] {
  const counts = new Map<number, HabitCompletionCount>();

  for (const row of rows) {
    const id = row.habitId;
    const title = row.habits?.title ?? "Unknown Habit";
    const existing = counts.get(id);
    if (existing) {
      existing.completionCount += 1;
    } else {
      counts.set(id, {
        habitId: id,
        title,
        completionCount: 1,
      });
    }
  }

  return [...counts.values()].sort(
    (a, b) => b.completionCount - a.completionCount,
  );
}

export const getAllTimeStatsService = async (email: string) => {
  const userId = await resolveUserId(email);
  const { data, error } = await getAllTimeCompletions(userId);
  if (error) {
    throw new ServiceError(
      "HabitStatsServiceError",
      "DATABASE_ERROR",
      error.message,
    );
  }

  const completionCounts = aggregateCompletions(data ?? []);
  const totalCompletions = completionCounts.reduce(
    (sum, h) => sum + h.completionCount,
    0,
  );
  const topHabit = completionCounts[0] ?? null;

  return {
    data: {
      totalCompletions,
      topHabit,
      completionCounts,
    },
    message: "All-time stats retrieved successfully",
    success: true,
  };
};
