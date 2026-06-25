import { convertTimestampToDate, toIsoDate } from "./datetime-helpers.js";

export const calculateStreaks = (
  completedDates: string[],
  today: Date,
): { currentStreak: number; longestStreak: number } => {
  if (completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = [
    ...new Set(completedDates.map(convertTimestampToDate)),
  ].sort();

  let longestStreak = 1;
  let runLength = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]!);
    const curr = new Date(sortedDates[i]!);
    const dayGap = daysBetween(prev, curr);

    if (dayGap === 1) {
      runLength += 1;
    } else {
      runLength = dayGap === 0 ? runLength : 1;
    }

    longestStreak = Math.max(longestStreak, runLength);
  }

  const todayIso = toIsoDate(today);
  const yesterdayIso = toIsoDate(addDays(today, -1));

  const completedSet = new Set(sortedDates);
  let anchorDate: Date;

  if (completedSet.has(todayIso)) {
    anchorDate = today;
  } else if (completedSet.has(yesterdayIso)) {
    anchorDate = addDays(today, -1);
  } else {
    console.log("No current streak found. Longest streak:", longestStreak);
    return { currentStreak: 0, longestStreak };
  }

  let currentStreak = 0;
  let cursor = anchorDate;

  console.log("Calculating current streak starting from:", cursor);

  while (completedSet.has(toIsoDate(cursor))) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  return { currentStreak, longestStreak };
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const aMid = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const bMid = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((bMid.getTime() - aMid.getTime()) / oneDay);
}
