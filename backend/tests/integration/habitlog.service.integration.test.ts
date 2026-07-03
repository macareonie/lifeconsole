// tests/integration/habitlog.service.integration.test.ts

import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { db } from "../../src/config/db.js";
import {
  getLogsByDateRangeService,
  toggleHabitLogService,
} from "../../src/modules/habittracker/habitlogs/habitlog.service.js";
import { toIsoDate } from "../../src/utils/datetime-helpers.js";
import {
  cleanupAllTestHabits,
  getTestUserId,
  seedTestHabit,
  testHabitTitle,
} from "./testHelpers.js";

describe("habitlog.service integration", () => {
  let userId: number;
  let habitId: number;

  beforeAll(async () => {
    userId = await getTestUserId();
  });

  afterAll(async () => {
    await cleanupAllTestHabits();
  });

  // Fresh habit per test, so toggling in one test never affects another.
  // afterEach (not afterAll-only) keeps the test DB clean even between
  // individual tests within this file, not just at the very end.
  afterEach(async () => {
    await cleanupAllTestHabits();
  });

  // ── Happy path ──────────────────────────────────────────────────────
  it("toggles a habit log from not-completed to completed on first call", async () => {
    habitId = await seedTestHabit(userId, testHabitTitle("toggle_basic"));

    await toggleHabitLogService(habitId, "2026-06-24");

    const { data: log } = await db
      .from("habitlogs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("date", "2026-06-24")
      .maybeSingle();

    expect(log).not.toBeNull();
    expect(log?.completed).toBe(true);
  });

  it("toggles back to not-completed on the second call for the same date", async () => {
    habitId = await seedTestHabit(userId, testHabitTitle("toggle_twice"));

    await toggleHabitLogService(habitId, "2026-06-24"); // -> true
    await toggleHabitLogService(habitId, "2026-06-24"); // -> false

    const { data: log } = await db
      .from("habitlogs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("date", "2026-06-24")
      .maybeSingle();

    expect(log?.completed).toBe(false);
  });

  // ── This test targets the bug spotted in the shared file:
  // `if (existing && lookupError)` only throws when BOTH existing and
  // lookupError are truthy. On a brand-new habit/date, `existing` is
  // null (nothing logged yet), so even if `lookupError` were set, this
  // check would currently skip past it silently and proceed to upsert
  // anyway, masking a real database error.
  //
  // This integration test establishes the correct baseline behavior
  // (new pair, no error, works fine). The actual boolean-logic bug is
  // better caught by a quick unit test asserting the condition directly
  // — see the note in the project plan for a `habitlog.service.test.ts`
  // unit test using a mocked repository that returns
  // { data: null, error: someError } and confirming toggle throws. ────
  it("creates a log correctly even when no prior log exists for that habit+date", async () => {
    habitId = await seedTestHabit(userId, testHabitTitle("toggle_new_pair"));

    await toggleHabitLogService(habitId, "2026-06-20");

    const { data: log } = await db
      .from("habitlogs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("date", "2026-06-20")
      .maybeSingle();

    expect(log).not.toBeNull();
    expect(log?.completed).toBe(true);
  });

  // ── This is the test most directly tied to a real bug found earlier
  // in development: habitlogs.date is stored as timestamptz, and a
  // naive date-string comparison can silently fail to match an existing
  // row, causing toggle to always behave as "first time" (always
  // creating, never flipping). This test seeds a log, then immediately
  // re-toggles for the exact same date string the caller would use,
  // confirming the round-trip through Supabase's timestamptz storage
  // and back doesn't break the lookup. ──────────────────────────────
  it("correctly finds an existing log even after a timestamptz round-trip through the database", async () => {
    habitId = await seedTestHabit(
      userId,
      testHabitTitle("timestamptz_roundtrip"),
    );

    await toggleHabitLogService(habitId, "2026-06-24"); // creates, completed=true

    // Confirm exactly one row exists before the second toggle — if the
    // date-matching were broken, the second toggle would INSERT a
    // second row instead of updating the existing one (upsert's
    // onConflict relies on matching habit_id+date correctly).
    const { data: beforeSecondToggle } = await db
      .from("habitlogs")
      .select("*")
      .eq("habit_id", habitId);
    expect(beforeSecondToggle).toHaveLength(1);

    await toggleHabitLogService(habitId, "2026-06-24"); // should flip to false, not create a 2nd row

    const { data: afterSecondToggle } = await db
      .from("habitlogs")
      .select("*")
      .eq("habit_id", habitId);

    expect(afterSecondToggle).toHaveLength(1); // still exactly one row
    expect(afterSecondToggle?.[0].completed).toBe(false);
  });

  // ── Confirms streak recompute actually persists to the habits row
  // after a toggle — this exercises the full chain: service -> upsert
  // log -> recompute streak -> update habits table, all against the
  // real database. ───────────────────────────────────────────────────
  it("updates the habit's current_streak after toggling a log to completed", async () => {
    habitId = await seedTestHabit(userId, testHabitTitle("streak_update"));

    const today = new Date().toISOString().slice(0, 10);
    await toggleHabitLogService(habitId, today);

    const { data: habit } = await db
      .from("habits")
      .select("current_streak")
      .eq("id", habitId)
      .maybeSingle();

    expect(habit?.current_streak).toBe(1);
  });

  // ── getLogsByDateRangeService ────────────────────────────────────────
  it("retrieves logs within a date range, scoped to the requesting user", async () => {
    habitId = await seedTestHabit(userId, testHabitTitle("range_query"));

    await toggleHabitLogService(habitId, "2026-06-22");
    await toggleHabitLogService(habitId, "2026-06-23");
    await toggleHabitLogService(habitId, "2026-06-25"); // outside the range below

    const result = await getLogsByDateRangeService(
      getTestUserEmail(),
      "2026-06-22",
      "2026-06-24",
    );

    const datesReturned = result.data.map((log: any) =>
      toIsoDate(new Date(log.date)),
    );
    expect(datesReturned).toContain("2026-06-22");
    expect(datesReturned).toContain("2026-06-23");
    expect(datesReturned).not.toContain("2026-06-25");
  });
});

// Small local helper since getLogsByDateRangeService takes an email,
// not a userId, unlike toggleHabitLogService. Pulls from the same env
// var as getTestUserId() in testHelpers.ts.
function getTestUserEmail(): string {
  const email = process.env.TEST_USER_EMAIL;
  if (!email) throw new Error("TEST_USER_EMAIL not set");
  return email;
}
