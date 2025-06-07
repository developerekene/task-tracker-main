/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import Section from './Section';
import DashboardOverview from './DashboardOverview';
import Settings from './Settings';
import CalendarView from './CalendarView';
import UserProfile from './UserProfile';
import TaskList from './TaskList';
import { FaTachometerAlt, FaTasks, FaUser, FaCalendarAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';


const DashboardWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  background-color: #0d0d0d;
  color: #fff;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
`;

const InitialsBadge = styled.div`
  background-color: #4a90e2;
  color: white;
  border-radius: 50%;
  padding: 10px;
  width: 40px;
  height: 40px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: ${({ isMenuCollapsed }: { isMenuCollapsed: boolean }) =>
    isMenuCollapsed ? '80px 1fr' : '250px 1fr'};
  transition: grid-template-columns 0.3s ease;
  height: calc(100vh - 60px);
`;

const Sidebar = styled.div`
  background-color: #111;
  border-right: 1px solid #222;
  padding: 20px;
`;

const ToggleMenuButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  margin-bottom: 20px;
`;

const MenuItem = styled.div`
  margin: 10px 0;
  cursor: pointer;
  &:hover {
    color: #4a90e2;
  }
`;

const Content = styled.div`
  padding: 20px;
  overFlow: auto;
`;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const Dashboard: React.FC<{ user: { firstName: string; lastName: string } }> = ({ user }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Dashboard');

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const renderSelectedComponent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <DashboardOverview />;
      case 'Tasks':
        return <TaskList />;
      case 'Profile':
        return <UserProfile />;
      case 'Calendar':
        return <CalendarView />;
      case 'Settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };


  return (
    <DashboardWrapper>
      <Header>
        <h1 style={{ fontSize: '1.5rem', color: '#4a90e2', margin: 0 }}>Task Mate</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: '1rem', color: '#ccc' }}>
            {getGreeting()}, {user.firstName}
          </p>
          <InitialsBadge>{initials}</InitialsBadge>
        </div>
      </Header>

      <Main isMenuCollapsed={isMenuCollapsed}>
        <Sidebar style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
          <ToggleMenuButton onClick={() => setIsMenuCollapsed(prev => !prev)}>
            {isMenuCollapsed ? '▶' : '◀'}
          </ToggleMenuButton>

          {!isMenuCollapsed && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {[
                // @ts-ignore
                { label: 'Dashboard', icon: <FaTachometerAlt />, key: 'Dashboard' },
                // @ts-ignore
                { label: 'Tasks', icon: <FaTasks />, key: 'Tasks' },
                // @ts-ignore
                { label: 'Calendar', icon: <FaCalendarAlt />, key: 'Calendar' },
                // @ts-ignore
                { label: 'Profile', icon: <FaUser />, key: 'Profile' },
                // @ts-ignore
                { label: 'Settings', icon: <FaCog />, key: 'Settings' },
              ].map(item => (
                <MenuItem
                  key={item.key}
                  onClick={() => setSelectedItem(item.key)}
                  style={{
                    color: selectedItem === item.key ? '#4a90e2' : '#fff',
                    fontWeight: selectedItem === item.key ? 'bold' : 'normal',
                  }}
                >
                  {/* @ts-ignore */}
                  {React.cloneElement(item.icon, { style: { marginRight: '8px' } })}
                  {item.label}
                </MenuItem>
              ))}

              <MenuItem
                // onClick={handleLogout}
                style={{ color: '#f44336', marginTop: 'auto' }}
              >
                {/* @ts-ignore */}
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                Log Out
              </MenuItem>
            </div>
          )}
        </Sidebar>

        <Content>
          {renderSelectedComponent()}
        </Content>
      </Main>
    </DashboardWrapper>
  );
};

export default Dashboard;