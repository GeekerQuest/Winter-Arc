import React from 'react'

const Header = () => {
  const startDate = new Date(2026,8,1);
  const today = new Date();
  const EndDate = new Date(2026,11,31);

  startDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  EndDate.setHours(0,0,0,0);

  const diffMs = today - startDate;
  const elapsedDays = Math.floor( diffMs / (1000*60*60*24));

  const diffMs2 = EndDate-startDate;
  const Total_Days = Math.floor( diffMs2 / (1000*60*60*24)) + 1;

  const currentDay = elapsedDays + 1;
  const daysRemaining = Total_Days-currentDay;

  return (
    <header className="header">
      <div>
        <h1>WINTER ARC</h1>
        <p>Day {currentDay} of {Total_Days}</p>

      </div>
        <div className='header-info'>
            <p>Started September 1, 2026</p>
            <p>{daysRemaining} days remaining</p>
        </div>
    </header>
  )
}

export default Header