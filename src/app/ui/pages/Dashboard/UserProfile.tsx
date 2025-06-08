import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { FaEdit, FaSave } from 'react-icons/fa';
import {
    FaTasks,
    FaCalendarAlt,
    FaUsers,
    FaBell,
    FaCheck,
    FaChartLine,
} from 'react-icons/fa';

const UserProfile = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const features = [
        {
            // @ts-ignore
            icon: <FaTasks size={32} />,
            title: 'Create Tasks',
            description: 'Easily add and manage tasks to keep your day organized.',
            color: '#FF6B6B',
        },
        {
            // @ts-ignore
            icon: <FaCalendarAlt size={32} />,
            title: 'Schedule Deadlines',
            description: 'Set deadlines and milestones to stay on track.',
            color: '#FFC107',
        },
        {
            // @ts-ignore
            icon: <FaUsers size={32} />,
            title: 'Collaborate',
            description: 'Work together with your team in real time.',
            color: '#6BCB77',
        },
        {
            // @ts-ignore
            icon: <FaBell size={32} />,
            title: 'Reminders',
            description: 'Get notified about what matters most.',
            color: '#4D96FF',
        },
        {
            // @ts-ignore
            icon: <FaCheck size={32} />,
            title: 'Complete Goals',
            description: 'Achieve personal or team goals with clarity.',
            color: '#9D4EDD',
        },
        {
            // @ts-ignore
            icon: <FaChartLine size={32} />,
            title: 'Track Progress',
            description: 'Monitor performance and task completion stats.',
            color: '#00C49A',
        },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // TODO: dispatch updated user to redux or call API
        console.log('Saved user data:', editedUser);
        setIsEditing(false);
    };

    return (
        <div
            style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Floating Edit/Save Button */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '90px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#6200ea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    zIndex: 1000,
                    transition: 'transform 0.2s ease-in-out',
                }}
                onClick={isEditing ? handleSave : handleEditClick}
            >
                {/* @ts-ignore */}
                {isEditing ? <FaSave color="#fff" size={24} /> : <FaEdit color="#fff" size={24} />}
            </div>

            {/* User Header - Non-editable */}
            <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.5rem' }}>
                {`${user.firstName} ${user.lastName}`}
            </h3>
            <p style={{ color: '#bbb', marginBottom: '30px', fontSize: '1rem' }}>
                {user.email}
            </p>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    padding: '40px',
                }}
            >
                {features.map((feature, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: feature.color,
                            color: '#fff',
                            padding: '24px',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = 'scale(1.05)')
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        {feature.icon}
                        <h4 style={{ marginTop: '12px', fontSize: '1.2rem' }}>
                            {feature.title}
                        </h4>
                        <p style={{ marginTop: '8px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Form Fields - Only Shown in Edit Mode */}
            {isEditing && (
                <>
                    <p style={{ color: '#bbb', marginBottom: '10px', fontSize: '1rem' }}>Let's update your profile</p>
                    <form
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            padding: '10px',
                        }}
                    >
                        {[
                            'FirstName',
                            'middleName',
                            'LastName',
                            'phone',
                            'gender',
                            'dateOfBirth',
                            'country',
                            'state',
                            'city',
                            'streetName',
                            'streetNumber',
                            'educationalLevel',
                            'referralName',
                            'secondaryEmail',
                            'securityQuestion',
                            'securityAnswer',
                        ].map(field => (
                            <div key={field} style={{ color: '#fff' }}>
                                <label
                                    htmlFor={field}
                                    style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '6px' }}
                                >
                                    {field}
                                </label>
                                <input
                                    type="text"
                                    name={field}
                                    id={field}
                                    value={(editedUser as any)[field]}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: '#2a2a2a',
                                        color: '#fff',
                                        border: '1px solid #444',
                                        borderRadius: '8px',
                                    }}
                                />
                            </div>
                        ))}
                    </form>
                </>
            )}
        </div>
    );
};

export default UserProfile;
