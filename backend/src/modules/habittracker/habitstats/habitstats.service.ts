import { ServiceError } from "../../../errors/service.error.js";
import { getAllTimeCompletions } from "../../../repositories/habittracker/habitlog.repository.js";
import { resolveUserId } from "../../../utils/email2userid.js";

type AlltimeCompletionRow = {
  habit_id: number;
  habits: { title: string };
};

type HabitCompletionCount = {
  habit_id: number;
  title: string;
  completion_count: number;
};

function aggregateCompletions(
  rows: AlltimeCompletionRow[],
): HabitCompletionCount[] {
  const counts = new Map<number, HabitCompletionCount>();

  for (const row of rows) {
    const existing = counts.get(row.habit_id);
    if (existing) {
      existing.completion_count += 1;
    } else {
      counts.set(row.habit_id, {
        habit_id: row.habit_id,
        title: row.habits.title,
        completion_count: 1,
      });
    }
  }

  return [...counts.values()].sort(
    (a, b) => b.completion_count - a.completion_count,
  );
}

export const getAllTimeStatsService = async (email: string) => {
  const user_id = await resolveUserId(email);
  const { data, error } = await getAllTimeCompletions(user_id);
  if (error) {
    throw new ServiceError("HabitStatsServiceError", error.message, 400);
  }

  const completionCounts = aggregateCompletions(data ?? []);
  const totalCompletions = completionCounts.reduce(
    (sum, h) => sum + h.completion_count,
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
