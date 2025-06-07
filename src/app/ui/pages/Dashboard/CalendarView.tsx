import React from 'react'

const CalendarView = () => {
  const handleCardClick = (section: string) => {
    alert(`Clicked on ${section}`);
  };

  const getCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // First day of month (0=Sun, 1=Mon, ...)
    const firstDay = new Date(year, month, 1).getDay();

    // Number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create array for calendar cells (42 cells = 6 weeks)
    const calendarDays = Array(42).fill(null);

    // Fill the days starting from firstDay offset
    for (let i = 0; i < daysInMonth; i++) {
      calendarDays[firstDay + i] = i + 1;
    }

    return { calendarDays, year, month, today };
  };

  const { calendarDays, year, month, today } = getCalendarDays();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return (
    <div
      style={{
        backgroundColor: '#e91e63', // bright pink
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgb(233 30 99 / 0.5)',
        transition: 'transform 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
      }}
    // onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
    // onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{ marginBottom: '15px', alignSelf: 'center', width: '48px', height: '48px' }}>
        <svg
          viewBox="0 0 24 24"
          fill="white"
          width="48"
          height="48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z" />
        </svg>
      </div>
      <h3 style={{ color: '#fff', marginBottom: '12px' }}>Calendar</h3>
      <div style={{ marginTop: '10px', width: '100%' }}>
        <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
          {monthNames[month]} {year}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '5px',
            textAlign: 'center',
            fontWeight: '600',
            color: '#555',
            marginBottom: '5px',
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '5px',
          }}
        >
          {calendarDays.map((day, idx) => {
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <div
                key={idx}
                style={{
                  padding: '8px 0',
                  borderRadius: '6px',
                  backgroundColor: isToday ? '#f48fb1' : '#fff',
                  color: isToday ? '#fff' : '#333',
                  boxShadow: isToday ? '0 0 8px #f48fb1' : 'none',
                  cursor: day ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
                onClick={() => day && alert(`Clicked on ${monthNames[month]} ${day}, ${year}`)}
              >
                {day || ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default CalendarView