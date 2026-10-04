import React from 'react'
import Header from './Components/Header'
import ProgressCard from './Components/ProgressCard'
import TaskList from './Components/TaskList'
import QuoteCard from './Components/QuoteCard'
import StreakCard from './Components/StreakCard'
import WeekCard from './Components/WeekCard'
import "./App.css";
import { useState, useEffect } from "react";

const App = () => {
  const [completedTask, setcompletedTask] = useState([]);
  const [completedDays, setcompletedDays] = useState(() => {
    const savedDays = localStorage.getItem("completedDays");

    return savedDays ? JSON.parse(savedDays) : [];
  });
  const todayDate = new Date();
  useEffect(() => {
    const today = todayDate.toISOString().slice(0, 10);
    if (completedTask.length === 4) {
      setcompletedDays(prev => {
        if (!prev.includes(today)) {
          return [...prev, today];
        }
        return prev;
      })
    }
  }, [completedTask])
  useEffect(() => {
    localStorage.setItem(
      "completedDays",
      JSON.stringify(completedDays)
    );
  }, [completedDays]);

  return (
    <div className='app'>
      <Header />
      <ProgressCard
        completedTasks={completedTask}
      />
      <TaskList
        completedTasks={completedTask}
        setcompletedTasks={setcompletedTask}
      />
      <WeekCard completedTasks={completedTask} completedDays={completedDays} />
      <StreakCard completedDays={completedDays} />
      <QuoteCard />
    </div>
  )
}

export default App