import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { db } from "../../src/config/db.js";
import {
  getMoodLogByDateRangeService,
  getMoodLogByDateService,
  setMoodLogService,
} from "../../src/modules/habittracker/moodlogs/moodlog.service.js";
import { cleanupTestMoodLogs, getTestUserId } from "./testHelpers.js";

describe("moodlog.service integration", () => {
  let userId: number;
  let testEmail: string;

  beforeAll(async () => {
    userId = await getTestUserId();
    testEmail = process.env.TEST_USER_EMAIL!;
    await cleanupTestMoodLogs(userId);
  });

  afterEach(async () => {
    await cleanupTestMoodLogs(userId);
  });

  afterAll(async () => {
    await cleanupTestMoodLogs(userId);
  });

  // ── setMoodLogService ───────────────────────────────────────────────

  it("creates a mood log row in the database with the correct mood value", async () => {
    await setMoodLogService(testEmail, { date: "2026-06-24", mood: 4 } as any);

    const { data } = await db
      .from("moodlogs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", "2026-06-24")
      .maybeSingle();

    expect(data).not.toBeNull();
    expect(data?.mood).toBe(4);
  });

  it("updates an existing mood log when called twice for the same date (upsert behavior)", async () => {
    await setMoodLogService(testEmail, { date: "2026-06-24", mood: 2 } as any);
    await setMoodLogService(testEmail, { date: "2026-06-24", mood: 5 } as any);

    // Only one row should exist — upsert, not two inserts.
    const { data } = await db
      .from("moodlogs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", "2026-06-24");

    expect(data).toHaveLength(1);
    expect(data?.[0].mood).toBe(5);
  });

  it("throws INVALID_MOOD_VALUE when mood is below 1", async () => {
    const { ServiceError } = await import("../../src/errors/service.error.js");

    const caught = await setMoodLogService(testEmail, {
      date: "2026-06-24",
      mood: 0,
    } as any).catch((e) => e);

    expect(caught).toBeInstanceOf(ServiceError);
    expect(caught.code).toBe("INVALID_MOOD_VALUE");

    const { data } = await db
      .from("moodlogs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", "2026-06-24")
      .maybeSingle();
    expect(data).toBeNull();
  });

  it("throws INVALID_MOOD_VALUE when mood is above 5", async () => {
    const { ServiceError } = await import("../../src/errors/service.error.js");

    const caught = await setMoodLogService(testEmail, {
      date: "2026-06-24",
      mood: 6,
    } as any).catch((e) => e);

    expect(caught).toBeInstanceOf(ServiceError);
    expect(caught.code).toBe("INVALID_MOOD_VALUE");
  });

  // ── getMoodLogByDateService ─────────────────────────────────────────

  it("retrieves a mood log for a specific date", async () => {
    await setMoodLogService(testEmail, { date: "2026-06-24", mood: 3 } as any);

    const result = await getMoodLogByDateService(testEmail, "2026-06-24");

    expect(result.data).not.toBeNull();
    expect(result.data?.mood).toBe(3);
  });

  it("returns null data when no mood log exists for the given date", async () => {
    // Nothing seeded for this date in this test.
    const result = await getMoodLogByDateService(testEmail, "2026-06-20");

    expect(result.data).toBeNull();
  });

  it("returns a date field that is parseable as a calendar date after a Supabase round-trip", async () => {
    await setMoodLogService(testEmail, { date: "2026-06-24", mood: 3 } as any);

    const result = await getMoodLogByDateService(testEmail, "2026-06-24");

    const rawDate = result.data?.date;
    expect(rawDate).toBeDefined();

    const normalized = new Date(rawDate).toISOString().slice(0, 10);
    expect(normalized).toBe("2026-06-24");
  });

  // ── getMoodLogByDateRangeService ────────────────────────────────────

  it("retrieves mood logs within a date range, scoped to the requesting user", async () => {
    await setMoodLogService(testEmail, { date: "2026-06-22", mood: 2 } as any);
    await setMoodLogService(testEmail, { date: "2026-06-23", mood: 4 } as any);
    await setMoodLogService(testEmail, { date: "2026-06-24", mood: 3 } as any);

    const result = await getMoodLogByDateRangeService(
      testEmail,
      "2026-06-22",
      "2026-06-23",
    );

    expect(result.data).toHaveLength(2);
    const dates = result.data.map((log: any) =>
      new Date(log.date).toISOString().slice(0, 10),
    );
    expect(dates).toContain("2026-06-22");
    expect(dates).toContain("2026-06-23");
    expect(dates).not.toContain("2026-06-24");
  });

  it("throws MISSING_REQUIRED_FIELD when start or end date is missing", async () => {
    const { ServiceError } = await import("../../src/errors/service.error.js");

    const caught = await getMoodLogByDateRangeService(
      testEmail,
      "",
      "2026-06-24",
    ).catch((e) => e);

    expect(caught).toBeInstanceOf(ServiceError);
    expect(caught.code).toBe("MISSING_REQUIRED_FIELD");
  });
});
