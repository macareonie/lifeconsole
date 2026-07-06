import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { toggleHabitLogService } from "../../src/modules/habittracker/habitlogs/habitlog.service.js";
import { getAllTimeStatsService } from "../../src/modules/habittracker/habitstats/habitstats.service.js";
import {
  cleanupAllTestHabits,
  getTestUserId,
  seedTestHabit,
  testHabitTitle,
} from "./testHelpers.js";

const TEST_TAG = "lcHabitStatsC";

describe("habitstats.service integration", () => {
  let userId: number;
  let testEmail: string;
  let habitIdA: number;
  let habitIdB: number;

  beforeAll(async () => {
    userId = await getTestUserId();
    testEmail = process.env.TEST_USER_EMAIL!;

    habitIdA = await seedTestHabit(userId, testHabitTitle("stats_A", TEST_TAG));
    habitIdB = await seedTestHabit(userId, testHabitTitle("stats_B", TEST_TAG));

    // Give habit A 3 completions across different dates, B only 1.
    // This determines which is "top habit" and the total count.
    await toggleHabitLogService(habitIdA, "2026-06-20");
    await toggleHabitLogService(habitIdA, "2026-06-21");
    await toggleHabitLogService(habitIdA, "2026-06-22");
    await toggleHabitLogService(habitIdB, "2026-06-22");
  });

  afterAll(async () => {
    await cleanupAllTestHabits(TEST_TAG);
  });

  it("returns a totalCompletions count that includes our seeded logs", async () => {
    const result = await getAllTimeStatsService(testEmail);

    expect(result.data.totalCompletions).toBeGreaterThanOrEqual(4);
  });

  it("identifies the correct top habit by completion count", async () => {
    const result = await getAllTimeStatsService(testEmail);

    const topHabitTitle = result.data.topHabit?.title ?? "";
    expect(topHabitTitle).toContain("stats_A");
  });

  it("returns completionCounts sorted descending by completionCount", async () => {
    const result = await getAllTimeStatsService(testEmail);
    const counts = result.data.completionCounts.map(
      (h: any) => h.completionCount,
    );

    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeLessThanOrEqual(counts[i - 1]);
    }
  });

  it("returns separate completionCount entries for each distinct habit (catches habit_id vs habitId aggregation bug)", async () => {
    const result = await getAllTimeStatsService(testEmail);
    const counts = result.data.completionCounts;

    const entryForA = counts.find((h: any) => h.title?.includes("stats_A"));
    const entryForB = counts.find((h: any) => h.title?.includes("stats_B"));

    // Both habits should appear as separate entries, not collapsed
    // into one row due to an undefined grouping key.
    expect(entryForA).toBeDefined();
    expect(entryForB).toBeDefined();

    expect(entryForA?.completionCount).toBe(3);
    expect(entryForB?.completionCount).toBe(1);

    expect(typeof entryForA?.habitId).toBe("number");
    expect(typeof entryForB?.habitId).toBe("number");
  });
});
