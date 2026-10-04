import React from 'react'

const WeekCard = ({completedTasks,completedDays}) => {

    const today = new Date();
    const currentDay = today.getDay();

    const dayNames = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];

    const todayIndex = (currentDay + 6) % 7;

    const days = dayNames.map((name, index) => {
        const dayDate = new Date(today);
        dayDate.setDate(
            dayDate.getDate() + index - todayIndex
        );
        const dateString = dayDate.toISOString().slice(0,10);
        const completed = completedDays.includes(dateString);
        return {
            name,
            completed,
            isToday: index === todayIndex,
        }
    });

    return (
        <section className="week-card">

            <div className="week-header">
                <h2>This Week</h2>

                <span>
                    <strong>{days.filter(day => day.completed).length}</strong> / 7 days
                </span>
            </div>

            <div className="week-days">

                {days.map((day) => (
                    <div
                        className={day.isToday ? "day today" : "day"}
                        key={day.name}
                    >
                        <span>{day.name}</span>

                        <div
                            className={
                                day.completed
                                    ? "day-dot completed-day"
                                    : "day-dot"
                            }
                        ></div>
                    </div>
                ))}

            </div>
        </section>
    );
};

export default WeekCard;