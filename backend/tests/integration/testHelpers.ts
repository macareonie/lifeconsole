import { db } from "../../src/config/db.js";
import {
  addHabit,
  deleteHabitById,
} from "../../src/repositories/habittracker/habit.repository.js";

const TEST_TAG = "INTEGRATION_TEST_";

export function testHabitTitle(suffix: string, tag = TEST_TAG): string {
  return `${tag}${suffix}_${Date.now()}`;
}

export async function seedTestHabit(userId: number, title: string) {
  const { error } = await addHabit(
    {
      title,
      frequency: "daily",
      currentStreak: 0,
      longestStreak: 0,
      streakUpdatedAt: null,
    } as any,
    userId,
  );

  if (error) {
    throw new Error(`Failed to seed test habit: ${error.message}`);
  }

  const { data: habits } = await db
    .from("habits")
    .select("id")
    .eq("title", title)
    .eq("user_id", userId)
    .maybeSingle();

  if (!habits) {
    throw new Error(`Could not find seeded habit "${title}" after insert`);
  }

  return habits.id as number;
}

export async function cleanupAllTestHabits(tag = TEST_TAG) {
  const { data: habits } = await db
    .from("habits")
    .select("id")
    .ilike("title", `%${tag}%`);

  const habitIds = (habits ?? []).map((h) => h.id as number);
  if (habitIds.length === 0) return;

  // in case cascade fails
  await db.from("habitlogs").delete().in("habit_id", habitIds);

  for (const id of habitIds) {
    await deleteHabitById(id);
  }
}

export async function getTestUserId(): Promise<number> {
  const testEmail = process.env.TEST_USER_EMAIL;
  if (!testEmail) {
    throw new Error(
      "TEST_USER_EMAIL is not set. Add it in testEnv in setup file",
    );
  }

  const { data, error } = await db
    .from("users")
    .select("id")
    .eq("email", testEmail)
    .maybeSingle();

  if (error || !data) {
    throw new Error(
      `Could not resolve test user id for ${testEmail}: ${error?.message ?? "not found"}`,
    );
  }

  return data.id as number;
}

export const TEST_DATES = [
  "2026-06-20",
  "2026-06-21",
  "2026-06-22",
  "2026-06-23",
  "2026-06-24",
];

export async function cleanupTestMoodLogs(userId: number) {
  await db
    .from("moodlogs")
    .delete()
    .eq("user_id", userId)
    .in("date", TEST_DATES);
}
