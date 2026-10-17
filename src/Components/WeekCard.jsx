import { getWeekDays } from '../utils/dateUtils.js';

const WeekCard = ({ completedDays }) => {
    const days = getWeekDays(new Date(), completedDays);

    return (
        <section className="week-card">
            <div className="week-header">
                <h2>This Week</h2>
                <span>
                    <strong>{days.filter((day) => day.completed).length}</strong> / 7 days
                </span>
            </div>

            <div className="week-days">
                {days.map((day) => (
                    <div className={day.isToday ? "day today" : "day"} key={day.date}>
                        <span>{day.name}</span>
                        <div className={day.completed ? "day-dot completed-day" : "day-dot"}></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WeekCard;
