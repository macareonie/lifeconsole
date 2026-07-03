import { beforeEach, describe, expect, it, vi } from "vitest";

import { ServiceError } from "../../src/errors/service.error.js";
import { toggleHabitLogService } from "../../src/modules/habittracker/habitlogs/habitlog.service.js";
import {
  getHabitLogByHabitAndDate,
  upsertHabitLog,
} from "../../src/repositories/habittracker/habitlog.repository.js";

vi.mock("../../src/repositories/habittracker/habitlog.repository.ts");

describe("toggleHabitLogService - error handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when the lookup fails, even if no existing log was found", async () => {
    vi.mocked(getHabitLogByHabitAndDate).mockResolvedValue({
      data: null, // no existing log — this is the case the current
      // buggy condition fails to handle correctly
      error: { message: "connection timeout" } as any,
    });

    await expect(toggleHabitLogService(1, "2026-06-24")).rejects.toThrow(
      ServiceError,
    );

    expect(upsertHabitLog).not.toHaveBeenCalled();
  });

  it("throws when the lookup fails AND an existing log was somehow also returned", async () => {
    vi.mocked(getHabitLogByHabitAndDate).mockResolvedValue({
      data: { id: 1, habitId: 1, date: "2026-06-24", completed: true },
      error: { message: "some error" } as any,
    });

    await expect(toggleHabitLogService(1, "2026-06-24")).rejects.toThrow(
      ServiceError,
    );
  });

  it("proceeds normally when the lookup succeeds with no existing log", async () => {
    vi.mocked(getHabitLogByHabitAndDate).mockResolvedValue({
      data: null,
      error: null,
    });
    vi.mocked(upsertHabitLog).mockResolvedValue({
      data: { id: 1, habitId: 1, date: "2026-06-24", completed: true },
      error: null,
    });

    await expect(toggleHabitLogService(1, "2026-06-24")).resolves.not.toThrow();

    expect(upsertHabitLog).toHaveBeenCalledWith(
      expect.objectContaining({ completed: true }),
    );
  });
});
