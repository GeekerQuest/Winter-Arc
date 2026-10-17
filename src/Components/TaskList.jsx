import { useState } from "react";

const TaskList = ({ tasks, customTaskIds, completedTasks, setdailyTasks, setCustomTasks, todayKey }) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [taskMessage, setTaskMessage] = useState("");

  const handleTaskChange = (e) => {
    const taskId = e.target.value;
    const checked = e.target.checked;

    setdailyTasks((prev) => {
      const todayTasks = prev[todayKey] || [];

      if (checked) {
        return { ...prev, [todayKey]: [...new Set([...todayTasks, taskId])] };
      }
      return {
        ...prev,
        [todayKey]: todayTasks.filter((value) => value !== taskId),
      };
    });
  };

  const handleAddTask = (event) => {
    event.preventDefault();
    const name = newTaskName.trim();
    if (!name) return;

    const alreadyExists = tasks.some((task) => task.name.toLowerCase() === name.toLowerCase());
    if (alreadyExists) {
      setTaskMessage("That task is already on your list.");
      return;
    }

    setCustomTasks((currentTasks) => [
      ...currentTasks,
      { id: `custom-${crypto.randomUUID()}`, name, createdOn: todayKey },
    ]);
    setNewTaskName("");
    setTaskMessage("Task added.");
  };

  return (
    <section className="Task-Card">
      <div className="task-head">
        <h2>Today's Tasks</h2>
      </div>
      <form className="add-task-form" onSubmit={handleAddTask}>
        <label className="visually-hidden" htmlFor="new-task-name">New task name</label>
        <input
          id="new-task-name"
          type="text"
          value={newTaskName}
          onChange={(event) => setNewTaskName(event.target.value)}
          placeholder="Add a task for yourself..."
          maxLength={60}
        />
        <button type="submit">+ Add task</button>
      </form>
      <p className="task-form-message" aria-live="polite">{taskMessage || "Your own habits can go here."}</p>

      <div className="task-list">
        <ul>
          {tasks.map((task) => (
            <li className={customTaskIds.has(task.id) ? "custom-task" : ""} key={task.id}>
              <label className="task-item">
                <span
                  className={completedTasks.includes(task.id) ? "completed" : ""}
                >
                  {task.name}
                </span>
                <input
                  type="checkbox"
                  value={task.id}
                  checked={completedTasks.includes(task.id)}
                  onChange={handleTaskChange}
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
      <p className="completed-summary">Completed: {completedTasks.length} of {tasks.length}</p>
    </section>
  )
}

export default TaskList
