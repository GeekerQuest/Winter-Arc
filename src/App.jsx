import Header from './Components/Header'
import ProgressCard from './Components/ProgressCard'
import TaskList from './Components/TaskList'
import QuoteCard from './Components/QuoteCard'
import StreakCard from './Components/StreakCard'
import WeekCard from './Components/WeekCard'
import ShareCard from './Components/ShareCard'
import "./App.css";
import { useState, useEffect } from "react";
import { getCompletedDates, getDateKey } from './utils/dateUtils.js'
import { tasks } from './utils/taskUtils.js'

const readDailyTasks = () => {
  try {
    const savedTasks = localStorage.getItem("dailyTasks");
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : {};
    return parsedTasks && typeof parsedTasks === "object" && !Array.isArray(parsedTasks)
      ? parsedTasks
      : {};
  } catch {
    return {};
  }
};

const readCustomTasks = () => {
  try {
    const savedTasks = localStorage.getItem("customTasks");
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
    return Array.isArray(parsedTasks)
      ? parsedTasks.filter((task) => task && typeof task.id === "string" && typeof task.name === "string")
      : [];
  } catch {
    return [];
  }
};

const getDeviceId = () => {
  let deviceId = localStorage.getItem("winterArcDeviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("winterArcDeviceId", deviceId);
  }
  return deviceId;
};

const App = () => {
  const [dailyTasks, setdailyTasks] = useState(readDailyTasks);
  const [customTasks, setCustomTasks] = useState(readCustomTasks);
  const [deviceId] = useState(getDeviceId);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [todayKey, setTodayKey] = useState(() => getDateKey(new Date()));
  const allTasks = [...tasks, ...customTasks];
  const customTaskIds = new Set(customTasks.map((task) => task.id));
  const completedDays = getCompletedDates(dailyTasks, allTasks);

  const completedTask = Array.isArray(dailyTasks[todayKey])
    ? [...new Set(dailyTasks[todayKey])]
    : [];
  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
    localStorage.setItem("customTasks", JSON.stringify(customTasks));
    if (!progressLoaded) return;

    const saveProgress = async () => {
      try {
        await fetch(`/api/progress/${encodeURIComponent(deviceId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dailyTasks, customTasks }),
        });
      } catch {
        // Keep local progress available if the backend is temporarily offline.
      }
    };

    saveProgress();
  }, [dailyTasks, customTasks, deviceId, progressLoaded]);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      try {
        const response = await fetch(`/api/progress/${encodeURIComponent(deviceId)}`);
        if (!response.ok) throw new Error("Could not load saved progress.");
        const { dailyTasks: remoteTasks, customTasks: remoteCustomTasks } = await response.json();
        if (cancelled) return;

        setCustomTasks((currentTasks) => {
          const mergedTasks = new Map(currentTasks.map((task) => [task.id, task]));
          for (const task of remoteCustomTasks || []) {
            if (task && typeof task.id === "string" && typeof task.name === "string") {
              mergedTasks.set(task.id, task);
            }
          }
          return [...mergedTasks.values()];
        });

        setdailyTasks((currentTasks) => {
          const mergedTasks = { ...currentTasks };
          for (const [date, taskIds] of Object.entries(remoteTasks || {})) {
            mergedTasks[date] = [...new Set([...(mergedTasks[date] || []), ...taskIds])];
          }
          return mergedTasks;
        });
      } catch {
        // Existing local progress remains usable if the backend is offline.
      } finally {
        if (!cancelled) setProgressLoaded(true);
      }
    };

    loadProgress();
    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTodayKey(getDateKey(new Date()));
    }, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="app-layout">
      <aside className="ad-space" aria-label="Advertisement space">
        <span className="ad-space-label">Ad space</span>
        <span className="ad-space-note">Reserved for an advertisement</span>
      </aside>

      <main className="dashboard">
        <Header />
        <QuoteCard dateKey={todayKey} />

        <div className="stats-grid">
          <ProgressCard
            completedTasks={completedTask}
            totalTasks={allTasks.length}
            dailyTasks={dailyTasks}
            tasks={allTasks}
          />
          <StreakCard completedDays={completedDays} />
        </div>

        <TaskList
          tasks={allTasks}
          customTaskIds={customTaskIds}
          completedTasks={completedTask}
          setdailyTasks={setdailyTasks}
          setCustomTasks={setCustomTasks}
          todayKey={todayKey}
        />
        <WeekCard completedDays={completedDays} />
        <ShareCard completedTasks={completedTask.length} totalTasks={allTasks.length} />
      </main>

      <aside className="future-summary-space" aria-hidden="true" />
    </div>
  )
}

export default App
