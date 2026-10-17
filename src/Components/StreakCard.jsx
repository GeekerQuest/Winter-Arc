import { getCurrentStreak, getLongestStreak } from "../utils/dateUtils.js";

const StreakCard = ({ completedDays }) => {
  const currentStreak = getCurrentStreak(completedDays);
  const longestStreak = getLongestStreak(completedDays);

  return (
    <section className="streak-card">
      <div className="top">
        <h2>Current Streak</h2>
        <span>🔥 {currentStreak} days</span>
      </div>

      <div className="mid">
        <div className="streak-number">{currentStreak}</div>
        <p>days</p>
      </div>

      <div className="bottom">
        <p>Longest streak: {longestStreak} days</p>
      </div>
    </section>
  );
};

export default StreakCard;
