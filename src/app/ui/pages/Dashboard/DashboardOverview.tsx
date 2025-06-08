import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Task } from '../../../redux/slices/task';
import { RootState } from '../../../redux/store';



interface Notification {
    id: number;
    message: string;
    type: 'created' | 'updated' | 'deleted' | 'modified';
    date: string;
}


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

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = Array(42).fill(null);

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
    const [columns, setColumns] = useState('repeat(auto-fit, minmax(300px, 1fr))');
    const tasks: Task[] = useSelector((state: RootState) => state.tasks)

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth < 480) {
                setColumns('1fr');
            } else if (window.innerWidth < 768) {
                setColumns('repeat(2, 1fr)');
            } else {
                setColumns('repeat(auto-fit, minmax(300px, 1fr))');
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const filteredTasks = tasks.filter((task: Task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredNotifications = tasks.filter((task: Task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCalendarDays = calendarDays.map((day) => {
        const dateString = `${monthNames[month]} ${day}, ${year}`;
        return searchTerm
            ? dateString.toLowerCase().includes(searchTerm.toLowerCase()) ? day : null
            : day;
    });

    const handleCardClick = (section: string) => {
        alert(`Clicked on ${section}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search on Dashboard"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    aria-label="Search Dashboard"
                    style={{
                        padding: '10px',
                        width: '100%',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                    }}
                />
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: columns,
                    gap: '20px',
                }}
            >
                {/* Tasks Card */}
                <div
                    style={{
                        backgroundColor: '#ff9800',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 15px rgb(255 152 0 / 0.5)',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ marginBottom: '35px', alignSelf: 'center' }}>
                        {/* icon */}
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
                        {filteredTasks.slice(0, 5).length === 0 ? (
                            <div style={{ color: '#fff' }}>No tasks found.</div>
                        ) : (
                            filteredTasks.slice(0, 5).map(task => (
                                <div
                                    key={task.id}
                                    style={{
                                        backgroundColor: '#2a2a2a',
                                        borderRadius: '10px',
                                        padding: '15px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                        color: '#fff',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <h3 style={{ margin: '0 0 10px' }}>{task.title}</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>{task.desc}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Notifications Card */}
                <div
                    style={{
                        backgroundColor: '#2196f3',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 15px rgb(33 150 243 / 0.5)',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ marginBottom: '35px', alignSelf: 'center' }}>
                        {/* icon */}
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
                        {filteredNotifications.length === 0 ? (
                            <div style={{ color: '#fff' }}>No notifications match your search.</div>
                        ) : (
                            filteredNotifications.map(note => (
                                <div
                                    key={note.id}
                                    style={{
                                        backgroundColor: '#1a73e8',
                                        borderRadius: '10px',
                                        padding: '15px',
                                        scrollbarWidth: 'none', /* Firefox */
                                        msOverflowStyle: 'none', /* IE and Edge */
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                        color: "#ffffff"
                                    }}
                                >
                                    <p style={{ margin: 0, fontWeight: '600' }}>{note.desc}</p>
                                    <small style={{ color: '#bbdefb' }}>{note.dateCreated}</small>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Task Progress */}
                <div
                    style={{
                        backgroundColor: '#4caf50',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 15px rgb(76 175 80 / 0.5)',
                        transition: 'transform 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <div style={{ marginBottom: '15px', alignSelf: 'center' }}>
                        {/* icon */}
                    </div>
                    <h3 style={{ color: '#fff', marginBottom: '15px' }}>
                        Task Progress (Last 5 Tasks)
                    </h3>
                    {filteredTasks.slice(-5).map(task => (
                        <div key={task.id} style={{
                            marginBottom: '12px'
                        }}>
                            <div style={{ color: '#fff', marginBottom: '4px' }}>{task.title}</div>
                            <div
                                style={{
                                    height: '10px',
                                    backgroundColor: 'rgba(255 255 255 / 0.3)',
                                    borderRadius: '5px',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* <div
                                    style={{
                                        width: `${task.progress}%`,
                                        height: '100%',
                                        backgroundColor: '#c8e6c9',
                                        transition: 'width 0.3s ease',
                                    }}
                                /> */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Calendar remains unchanged */}
                {/* ... */}
            </div>
        </div>
    );
};

export default DashboardOverview;
