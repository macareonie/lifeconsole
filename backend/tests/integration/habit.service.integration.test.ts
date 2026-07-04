import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { db } from "../../src/config/db.js";
import { ServiceError } from "../../src/errors/service.error.js";
import {
  addHabitService,
  deleteHabitByIdService,
  getAllUserHabitsService,
  updateHabitByIdService,
} from "../../src/modules/habittracker/habits/habit.service.js";
import {
  cleanupAllTestHabits,
  getTestUserId,
  seedTestHabit,
  testHabitTitle,
} from "./testHelpers.js";

const TEST_TAG = "lcHabitA";

describe("habit.service integration", () => {
  let userId: number;
  let testEmail: string;

  beforeAll(async () => {
    userId = await getTestUserId();
    testEmail = process.env.TEST_USER_EMAIL!;
  });

  afterEach(async () => {
    await cleanupAllTestHabits(TEST_TAG);
  });

  afterAll(async () => {
    await cleanupAllTestHabits(TEST_TAG);
  });

  // ── addHabitService ─────────────────────────────────────────────────

  it("creates a habit row in the database with the correct title", async () => {
    const title = testHabitTitle("add_basic", TEST_TAG);

    await addHabitService({ title, frequency: "daily" } as any, testEmail);

    const { data } = await db
      .from("habits")
      .select("*")
      .eq("title", title)
      .maybeSingle();

    expect(data).not.toBeNull();
    expect(data?.title).toBe(title);
  });

  it("throws MISSING_REQUIRED_FIELD when title is empty", async () => {
    await expect(
      addHabitService({ title: "", frequency: "daily" } as any, testEmail),
    ).rejects.toThrow(ServiceError);

    const caught = await addHabitService(
      { title: "", frequency: "daily" } as any,
      testEmail,
    ).catch((e) => e);

    expect(caught.code).toBe("MISSING_REQUIRED_FIELD");
  });

  // ── getAllUserHabitsService ──────────────────────────────────────────

  it("returns only habits belonging to the requesting user", async () => {
    const titleA = testHabitTitle("get_all_A", TEST_TAG);
    const titleB = testHabitTitle("get_all_B", TEST_TAG);

    await seedTestHabit(userId, titleA);
    await seedTestHabit(userId, titleB);

    const result = await getAllUserHabitsService(testEmail);
    const titles = result.data?.map((h: any) => h.title) ?? [];

    expect(titles).toContain(titleA);
    expect(titles).toContain(titleB);
  });

  it("returns camelCase field names on each habit (verifying snakeToCamel conversion)", async () => {
    const title = testHabitTitle("camel_case_check", TEST_TAG);
    await seedTestHabit(userId, title);

    const result = await getAllUserHabitsService(testEmail);
    const habit = result.data?.find((h: any) => h.title === title);

    expect(habit).not.toBeUndefined();
    expect(habit).toHaveProperty("currentStreak");
    expect(habit).toHaveProperty("longestStreak");
    expect(habit).not.toHaveProperty("current_streak");
    expect(habit).not.toHaveProperty("longest_streak");
  });

  it("returns habits in stable insertion order (ordered by id ascending)", async () => {
    await seedTestHabit(userId, testHabitTitle("order_A", TEST_TAG));
    await seedTestHabit(userId, testHabitTitle("order_B", TEST_TAG));
    await seedTestHabit(userId, testHabitTitle("order_C", TEST_TAG));

    const result = await getAllUserHabitsService(testEmail);

    const seededHabits = result.data?.filter((h: any) =>
      h.title?.includes("INTEGRATION_TEST_"),
    );
    const ids = seededHabits?.map((h: any) => h.id);
    expect(ids).toEqual([...ids!].sort((a, b) => a - b));
  });

  // ── updateHabitByIdService ──────────────────────────────────────────

  it("updates a habit's title in the database", async () => {
    const originalTitle = testHabitTitle("update_before", TEST_TAG);
    const updatedTitle = testHabitTitle("update_after", TEST_TAG);
    const habitId = await seedTestHabit(userId, originalTitle);

    await updateHabitByIdService(habitId, { title: updatedTitle });

    const { data } = await db
      .from("habits")
      .select("title")
      .eq("id", habitId)
      .maybeSingle();

    expect(data?.title).toBe(updatedTitle);
  });

  it("throws NOT_FOUND when habitId is falsy (0 or undefined)", async () => {
    const { ServiceError } = await import("../../src/errors/service.error.js");

    const caught = await updateHabitByIdService(0, { title: "anything" }).catch(
      (e) => e,
    );

    expect(caught).toBeInstanceOf(ServiceError);
    expect(caught.code).toBe("NOT_FOUND");
  });

  // ── deleteHabitByIdService ──────────────────────────────────────────

  it("removes the habit row from the database", async () => {
    const title = testHabitTitle("delete_me", TEST_TAG);
    const habitId = await seedTestHabit(userId, title);

    await deleteHabitByIdService(habitId);

    const { data } = await db
      .from("habits")
      .select("id")
      .eq("id", habitId)
      .maybeSingle();
    expect(data).toBeNull();
  });

  it("throws NOT_FOUND when habitId is falsy", async () => {
    const { ServiceError } = await import("../../src/errors/service.error.js");

    const caught = await deleteHabitByIdService(0).catch((e) => e);

    expect(caught).toBeInstanceOf(ServiceError);
    expect(caught.code).toBe("NOT_FOUND");
  });
});
