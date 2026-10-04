import React from 'react'

const TaskList = ({ completedTasks, setcompletedTasks }) => {
  const handleTaskChange = (e) => {
    if (e.target.checked) {
      setcompletedTasks(prev => [
        ...prev,e.target.value
      ]);
    } else {
      // completedTasks = completedTasks.filter(val => val !== e.target.value) //const value cannot be modified
      setcompletedTasks( prev =>
              prev.filter(val => val !== e.target.value)
      );
    }
  }
  const tasks = [
    {
      id: "squats",
      name: "15 Squats - 2 reps"
    },
    {
      id: "climbers",
      name: "20 Mountain Climbers"
    },
    {
      id: "jacks",
      name: "20 Jumping Jacks"
    },
    {
      id: "pushups",
      name: "20 Inclined PushUps"
    }
  ];
  return (
    <section className='Task-Card'>
      <div className='task-head'>
        <h2>Today's Tasks</h2>
      </div>
      <div className='task-list'>
        <ul>
          {/* Learned New */}
          {tasks.map((task) => (
            <li key={task.id}>

              <label>

                <span
                  className={
                    completedTasks.includes(task.id)
                      ? "completed"
                      : ""
                  }
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
      <p>Completed: {completedTasks.join(", ")}</p>
    </section>
  )
}

export default TaskList