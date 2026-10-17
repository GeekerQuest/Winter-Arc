export const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const shiftDate = (date, amount) => {
  const shifted = new Date(date);
  shifted.setHours(0, 0, 0, 0);
  shifted.setDate(shifted.getDate() + amount);
  return shifted;
};

export const getCompletedDates = (dailyTasks, tasks) => {
  if (!dailyTasks || typeof dailyTasks !== "object" || !Array.isArray(tasks) || tasks.length === 0) {
    return [];
  }

  return Object.entries(dailyTasks)
    .filter(([date, completedTaskIds]) => {
      if (!Array.isArray(completedTaskIds)) return false;
      const completed = new Set(completedTaskIds);
      const requiredTaskIds = tasks
        .filter((task) => typeof task === "string" || !task.createdOn || task.createdOn <= date)
        .map((task) => typeof task === "string" ? task : task.id);
      return requiredTaskIds.length > 0 && requiredTaskIds.every((taskId) => completed.has(taskId));
    })
    .map(([date]) => date)
    .sort();
};

const getConsecutiveDays = (completedDates, startDate) => {
  const completed = new Set(completedDates);
  let date = new Date(startDate);
  date.setHours(0, 0, 0, 0);
  let streak = 0;

  while (completed.has(getDateKey(date))) {
    streak += 1;
    date = shiftDate(date, -1);
  }
  return streak;
};

export const getCurrentStreak = (completedDates, today = new Date()) => {
  const completed = new Set(completedDates);
  const currentDay = new Date(today);
  currentDay.setHours(0, 0, 0, 0);

  // An unfinished current day does not break a streak until the day ends.
  const startingDate = completed.has(getDateKey(currentDay))
    ? currentDay
    : shiftDate(currentDay, -1);
  return getConsecutiveDays(completed, startingDate);
};

export const getLongestStreak = (completedDates) => {
  const completed = [...new Set(completedDates)].sort();
  if (completed.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let index = 1; index < completed.length; index += 1) {
    const previous = new Date(`${completed[index - 1]}T00:00:00`);
    const next = new Date(`${completed[index]}T00:00:00`);
    previous.setDate(previous.getDate() + 1);
    if (getDateKey(previous) === getDateKey(next)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
};

export const getWeekDays = (date, completedDates) => {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = shiftDate(today, -mondayOffset);
  const completed = new Set(completedDates);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return dayNames.map((name, index) => {
    const dayDate = shiftDate(monday, index);
    const dateKey = getDateKey(dayDate);
    return {
      name,
      date: dateKey,
      completed: completed.has(dateKey),
      isToday: dateKey === getDateKey(today),
    };
  });
};
