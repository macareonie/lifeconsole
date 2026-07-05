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

const TEST_TAG = "lcHabitLogB";

describe("habitlog.service integration", () => {
  let userId: number;
  let habitId: number;

  beforeAll(async () => {
    userId = await getTestUserId();
  });

  afterAll(async () => {
    await cleanupAllTestHabits(TEST_TAG);
  });

  afterEach(async () => {
    await cleanupAllTestHabits(TEST_TAG);
  });

  it("toggles a habit log from not-completed to completed on first call", async () => {
    habitId = await seedTestHabit(
      userId,
      testHabitTitle("toggle_basic", TEST_TAG),
    );

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
    habitId = await seedTestHabit(
      userId,
      testHabitTitle("toggle_twice", TEST_TAG),
    );

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

  it("creates a log correctly even when no prior log exists for that habit+date", async () => {
    habitId = await seedTestHabit(
      userId,
      testHabitTitle("toggle_new_pair", TEST_TAG),
    );

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

  it("correctly finds an existing log even after an immediate toggle", async () => {
    habitId = await seedTestHabit(
      userId,
      testHabitTitle("timestamptz_roundtrip", TEST_TAG),
    );

    await toggleHabitLogService(habitId, "2026-06-24");

    const { data: beforeSecondToggle } = await db
      .from("habitlogs")
      .select("*")
      .eq("habit_id", habitId);
    expect(beforeSecondToggle).toHaveLength(1);

    await toggleHabitLogService(habitId, "2026-06-24");

    const { data: afterSecondToggle } = await db
      .from("habitlogs")
      .select("*")
      .eq("habit_id", habitId);

    expect(afterSecondToggle).toHaveLength(1);
    expect(afterSecondToggle?.[0].completed).toBe(false);
  });

  it("updates the habit's current_streak after toggling a log to completed", async () => {
    habitId = await seedTestHabit(
      userId,
      testHabitTitle("streak_update", TEST_TAG),
    );

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
    habitId = await seedTestHabit(
      userId,
      testHabitTitle("range_query", TEST_TAG),
    );

    await toggleHabitLogService(habitId, "2026-06-22");
    await toggleHabitLogService(habitId, "2026-06-23");
    await toggleHabitLogService(habitId, "2026-06-25");

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

function getTestUserEmail(): string {
  const email = process.env.TEST_USER_EMAIL;
  if (!email) throw new Error("TEST_USER_EMAIL not set");
  return email;
}
