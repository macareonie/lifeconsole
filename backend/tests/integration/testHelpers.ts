// tests/integration/testHelpers.ts

import { db } from "../../src/config/db.js"; // adjust path to your actual db client location
import {
  addHabit,
  deleteHabitById,
} from "../../src/repositories/habittracker/habit.repository.js";

// Every test run gets a unique tag baked into every habit title it
// creates. This makes cleanup unambiguous even if a previous run's
// afterEach/afterAll crashed before it could clean up — you can always
// find and remove anything tagged "INTEGRATION_TEST_" regardless of
// which run created it.
const TEST_TAG = "INTEGRATION_TEST_";

export function testHabitTitle(suffix: string): string {
  return `${TEST_TAG}${suffix}_${Date.now()}`;
}

// Creates a real habit row via the real repository function (not the
// service, deliberately — we want a minimal, direct way to seed data
// without depending on the service logic we might be testing in the
// same file).
export async function seedTestHabit(userId: number, title: string) {
  const { data, error } = await addHabit(
    {
      title,
      frequency: "daily",
      currentStreak: 0,
      longestStreak: 0,
      streakUpdatedAt: null,
    } as any, // cast: addHabit's Habit type may require fields not relevant here
    userId,
  );

  if (error) {
    throw new Error(`Failed to seed test habit: ${error.message}`);
  }

  // Supabase's basic .insert() without .select() doesn't return the
  // created row — fetch it back by title to get its id, since later
  // cleanup and test assertions need the real id.
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

// Removes every habit (and, via cascade or explicit delete, its logs)
// whose title contains the test tag. Safe to call even if nothing
// matches, and safe to call multiple times.
export async function cleanupAllTestHabits() {
  const { data: habits } = await db
    .from("habits")
    .select("id")
    .ilike("title", `%${TEST_TAG}%`);

  const habitIds = (habits ?? []).map((h) => h.id as number);
  if (habitIds.length === 0) return;

  // habitlogs first — if there's no ON DELETE CASCADE on the FK, deleting
  // the habit first would leave orphaned log rows behind.
  await db.from("habitlogs").delete().in("habit_id", habitIds);

  for (const id of habitIds) {
    await deleteHabitById(id);
  }
}

// Some tests need a real, valid userId to satisfy foreign key
// constraints and RLS. Rather than hardcoding one, look up the test
// account's id by the email it logs in with — same account your
// Playwright E2E suite already authenticates as.
export async function getTestUserId(): Promise<number> {
  const testEmail = process.env.TEST_USER_EMAIL;
  if (!testEmail) {
    throw new Error(
      "TEST_USER_EMAIL is not set. Add it to .env.test, pointing at the " +
        "same admin/dummy account your Playwright E2E suite logs in as.",
    );
  }

  const { data, error } = await db
    .from("users") // adjust table name if different in your schema
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
