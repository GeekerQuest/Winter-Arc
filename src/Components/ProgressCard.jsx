import React from 'react'

const ProgressCard = ({completedTasks}) => {
  const b = completedTasks.length
  const progress = (b/4)*100

  return (
    <section className="progress-card">
      <div className="progress-top">
            <h2>Today's Progress</h2>
            <span>{progress}%</span>
      </div>
      <div className='progress-bar'>
        <div 
        className="progress-fill"
        style={{ width : `${progress}%`}}
        >
        </div>
      </div>
      <p>{completedTasks.length} of 4 tasks completed</p>
        
    </section>
  )
}

export default ProgressCard