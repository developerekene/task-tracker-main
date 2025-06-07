import React, { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    progress: number; // 0-100%
    description: string;
    status: string;
}

interface Notification {
    id: number;
    message: string;
    type: 'created' | 'updated' | 'deleted' | 'modified';
    date: string;
}

const mockTasks: Task[] = [
    { id: 1, title: 'Task One', description: 'Description for task one', progress: 20, status: 'priority' },
    { id: 2, title: 'Task Two', description: 'Description for task two', progress: 50, status: 'in-progress' },
    { id: 3, title: 'Task Three', description: 'Description for task three', progress: 100, status: 'completed' },
    { id: 4, title: 'Task Four', description: 'Description for task four', progress: 75, status: 'pending' },
    { id: 5, title: 'Task Five', description: 'Description for task five', progress: 30, status: 'overdue' },
    { id: 6, title: 'Task Six', description: 'Description for task six', progress: 60, status: 'in-progress' },
];


const mockNotifications: Notification[] = [
    { id: 1, message: 'Task One created', type: 'created', date: '2025-06-06' },
    { id: 2, message: 'Task Two updated', type: 'updated', date: '2025-06-05' },
    { id: 3, message: 'Task Three deleted', type: 'deleted', date: '2025-06-04' },
    { id: 4, message: 'Task Four modified', type: 'modified', date: '2025-06-03' },
];

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

const DashboardOverview: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Responsive state for grid columns
    const [columns, setColumns] = useState('repeat(auto-fit, minmax(300px, 1fr))');

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth < 480) {
                setColumns('1fr'); // 1 column on small screens
            } else if (window.innerWidth < 768) {
                setColumns('repeat(2, 1fr)'); // 2 columns on medium screens
            } else {
                setColumns('repeat(auto-fit, minmax(300px, 1fr))'); // default
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const filteredTasks = mockTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lastFiveTasks = mockTasks.slice(-5);

    // Card click handlers (example)
    const handleCardClick = (section: string) => {
        alert(`Clicked on ${section}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Search Bar on top */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search on Dashboard"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '100%',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                    }}
                />
            </div>

            {/* Grid container */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                }}
            >
                {/* Tasks Card */}
                <div
                    onClick={() => handleCardClick('Tasks')}
                    style={{
                        backgroundColor: '#ff9800', // bright orange
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgb(255 152 0 / 0.5)',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ marginBottom: '35px', alignSelf: 'center' }}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="white"
                            width="48"
                            height="48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9 7h6v10H9z" />
                            <path d="M7 5h10v14H7z" opacity=".3" />
                            <path d="M5 3h14v18H5z" />
                        </svg>
                    </div>
                    <h3 style={{ color: '#fff', marginBottom: '12px' }}>Tasks</h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            padding: '10px',
                            scrollbarWidth: 'none', /* Firefox */
                            msOverflowStyle: 'none', /* IE and Edge */
                        }}
                    >
                        {mockTasks.slice(0, 5).map(task => (
                            <div
                                key={task.id}
                                style={{
                                    backgroundColor: '#2a2a2a',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                <h3 style={{ margin: '0 0 10px' }}>{task.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>{task.description}</p>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Notifications Card */}
                <div
                    onClick={() => handleCardClick('Notifications')}
                    style={{
                        backgroundColor: '#2196f3', // bright blue
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgb(33 150 243 / 0.5)',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ marginBottom: '35px', alignSelf: 'center' }}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="white"
                            width="48"
                            height="48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M3,15V9H5V15H3M19,9V15H21V9H19M1,19H23V21H1V19M7,11V13H17V11H7M11,3H13V5H11V3M7,5H9V3H7V5M15,3H17V5H15V3M1,5V7H3V5H1M21,5V7H23V5H21M1,15H3V17H1V15M21,15H23V17H21V15Z" />
                        </svg>
                    </div>
                    <h3 style={{ color: '#fff', marginBottom: '12px' }}>Notifications</h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            padding: '10px',
                            color: '#e3f2fd',
                            scrollbarWidth: 'none', /* Firefox */
                            msOverflowStyle: 'none', /* IE and Edge */
                        }}
                    >
                        {mockNotifications.map(note => (
                            <div
                                key={note.id}
                                style={{
                                    backgroundColor: '#1a73e8',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                    color:
                                        note.type === 'deleted'
                                            ? '#ef9a9a'
                                            : note.type === 'created'
                                                ? '#a5d6a7'
                                                : note.type === 'updated'
                                                    ? '#90caf9'
                                                    : '#fff59d',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                <p style={{ margin: 0, fontWeight: '600' }}>{note.message}</p>
                                <small style={{ color: '#bbdefb' }}>{note.date}</small>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Task Progress Card */}
                <div
                    onClick={() => handleCardClick('Task Progress')}
                    style={{
                        backgroundColor: '#4caf50', // bright green
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgb(76 175 80 / 0.5)',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ marginBottom: '15px', alignSelf: 'center' }}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="white"
                            width="48"
                            height="48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M3 13h18v-2H3v2z" />
                            <path d="M12 3v10" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                    <h3 style={{ color: '#fff', marginBottom: '15px' }}>
                        Task Progress (Last 5 Tasks)
                    </h3>
                    {lastFiveTasks.map(task => (
                        <div key={task.id} style={{ marginBottom: '12px' }}>
                            <div style={{ color: '#fff', marginBottom: '4px' }}>{task.title}</div>
                            <div
                                style={{
                                    height: '10px',
                                    backgroundColor: 'rgba(255 255 255 / 0.3)',
                                    borderRadius: '5px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: `${task.progress}%`,
                                        height: '100%',
                                        backgroundColor: '#c8e6c9',
                                        transition: 'width 0.3s ease',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Calendar Card */}
                <div
                    onClick={() => handleCardClick('Calendar')}
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
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
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
            </div>

        </div>
    );
};

export default DashboardOverview;