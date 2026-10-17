import { useEffect, useState } from "react";
import { getDateKey } from "../utils/dateUtils.js";

const getLastSevenDays = (dailyTasks, tasks) => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const dateKey = getDateKey(date);
    const requiredTasks = tasks.filter((task) => !task.createdOn || task.createdOn <= dateKey);
    const completed = new Set(Array.isArray(dailyTasks[dateKey]) ? dailyTasks[dateKey] : []);
    const completedCount = requiredTasks.filter((task) => completed.has(task.id)).length;
    const percentage = requiredTasks.length
      ? Math.round((completedCount / requiredTasks.length) * 100)
      : 0;

    return {
      dateKey,
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      isToday: index === 6,
      percentage,
    };
  });
};

const getBarColor = (percentage) => {
  if (percentage < 25) return "#ff4d55";
  if (percentage < 50) return "#ff9f43";
  if (percentage < 75) return "#b8ea83";
  return "#39ff14";
};

const ProgressCard = ({ completedTasks, totalTasks, dailyTasks, tasks }) => {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const completedCount = completedTasks.length;
  const progress = totalTasks ? Math.min(100, Math.round((completedCount / totalTasks) * 100)) : 0;
  const progressStyle = {
    "--red-end": `${Math.min(progress, 25)}%`,
    "--orange-end": `${Math.min(progress, 50)}%`,
    "--light-green-end": `${Math.min(progress, 75)}%`,
    "--progress-end": `${progress}%`,
  };
  const lastSevenDays = getLastSevenDays(dailyTasks, tasks);
  const average = Math.round(
    lastSevenDays.reduce((sum, day) => sum + day.percentage, 0) / lastSevenDays.length
  );

  useEffect(() => {
    if (!analyticsOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setAnalyticsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [analyticsOpen]);

  return (
    <section className="progress-card">
      <div className="progress-heading">
        <h2 className="progress-title">Today's Progress</h2>
        <button className="analytics-info" type="button" aria-label="About progress analytics">
          i
          <span className="analytics-tooltip" role="tooltip">
            View last 7 days analytics by clicking on card.
          </span>
        </button>
      </div>
      <button
        className="progress-circle-trigger"
        type="button"
        onClick={() => setAnalyticsOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Today's progress is ${progress} percent. Open the last 7 days analytics.`}
      >
        <div className="progress-circle" style={progressStyle} aria-hidden="true">
          <span className="progress-percentage">{progress}%</span>
        </div>
      </button>
      <p>{completedCount} of {totalTasks} tasks completed</p>

      {analyticsOpen && (
        <div
          className="analytics-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAnalyticsOpen(false);
          }}
        >
          <section
            className="analytics-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-title"
          >
            <div className="analytics-dialog-header">
              <div>
                <p className="analytics-eyebrow">YOUR CONSISTENCY</p>
                <h2 id="analytics-title">Last 7 days</h2>
              </div>
              <button
                className="analytics-close"
                type="button"
                onClick={() => setAnalyticsOpen(false)}
                aria-label="Close analytics"
              >
                ×
              </button>
            </div>

            <div className="analytics-average">
              <span>Average task completion</span>
              <strong>{average}%</strong>
            </div>

            <div
              className="analytics-chart"
              role="img"
              aria-label={`Average task completion over the last 7 days: ${lastSevenDays.map((day) => `${day.day} ${day.percentage}%`).join(", ")}`}
            >
              {lastSevenDays.map((day) => (
                <div className="analytics-day" key={day.dateKey}>
                  <span className="analytics-bar-value">{day.percentage}%</span>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar"
                      style={{
                        height: `${Math.max(day.percentage, 2)}%`,
                        backgroundColor: getBarColor(day.percentage),
                      }}
                    />
                  </div>
                  <span className={day.isToday ? "analytics-day-name today" : "analytics-day-name"}>
                    {day.isToday ? "Today" : day.day}
                  </span>
                  <span className="analytics-date">{day.date}</span>
                </div>
              ))}
            </div>
            <p className="analytics-footnote">Each bar shows the share of that day’s tasks you completed.</p>
          </section>
        </div>
      )}
    </section>
  )
}

export default ProgressCard
