const StreakCard = ({ completedDays }) => {
  return (
    <section className="streak-card">

      <div className="top">
        <h2>Current Streak</h2>
        <span>🔥 1 day</span>
      </div>

      <div className="mid">
        <div className="streak-number">
          {completedDays.length}
        </div>
        <p>days</p>
      </div>

      <div className="bottom">
        <p>Keep going, rock it!</p>
      </div>

    </section>
  )
}

export default StreakCard