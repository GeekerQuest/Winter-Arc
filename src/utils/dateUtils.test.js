import test from "node:test";
import assert from "node:assert/strict";
import {
  getCompletedDates,
  getCurrentStreak,
  getDateKey,
  getLongestStreak,
  getWeekDays,
} from "./dateUtils.js";

const taskIds = ["a", "b"];

test("completed dates require all tasks and contain one entry per calendar date", () => {
  const records = {
    "2026-10-13": ["a", "a", "b"],
    "2026-10-14": ["a"],
    "2026-10-15": ["b", "a"],
  };

  assert.deepEqual(getCompletedDates(records, taskIds), ["2026-10-13", "2026-10-15"]);
  assert.deepEqual(getCompletedDates({}, taskIds), []);
  assert.deepEqual(getCompletedDates(null, taskIds), []);
});

test("current streak continues through an incomplete today, but stops after a missed day", () => {
  const today = new Date(2026, 9, 15, 12);
  assert.equal(getCurrentStreak(["2026-10-13", "2026-10-14"], today), 2);
  assert.equal(getCurrentStreak(["2026-10-14"], today), 1);
  assert.equal(getCurrentStreak(["2026-10-12"], today), 0);
  assert.equal(getCurrentStreak([], today), 0);
});

test("longest streak uses unique consecutive calendar dates", () => {
  assert.equal(
    getLongestStreak(["2026-10-01", "2026-10-02", "2026-10-02", "2026-10-04", "2026-10-05", "2026-10-06"]),
    3,
  );
  assert.equal(getLongestStreak([]), 0);
});

test("week view maps Monday through Sunday to actual local date keys", () => {
  const days = getWeekDays(new Date(2026, 9, 15, 12), ["2026-10-12", "2026-10-15"]);
  assert.deepEqual(days.map((day) => day.date), [
    "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15",
    "2026-10-16", "2026-10-17", "2026-10-18",
  ]);
  assert.equal(days.filter((day) => day.completed).length, 2);
  assert.equal(days.find((day) => day.isToday).date, getDateKey(new Date(2026, 9, 15)));
});
