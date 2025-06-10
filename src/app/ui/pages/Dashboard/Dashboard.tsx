/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import Section from './Section';
import DashboardOverview from './DashboardOverview';
import Settings from './Settings';
import CalendarView from './CalendarView';
import UserProfile from './UserProfile';
import TaskList from './TaskList';
import Notifications from './Notifications';
import Navbar from '../../components/Navbar';

import { FaTachometerAlt, FaTasks, FaUser, FaCalendarAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { authService } from '../../../redux/configuration/auth.service';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../../Routes/Index';
import { hideSidebar, toggleMobileSidebar } from '../../../redux/slices/sidebar';

const DashboardWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  background-color: #0d0d0d;
  color: #fff;
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: ${({ isMenuCollapsed }: { isMenuCollapsed: boolean }) =>
    isMenuCollapsed ? '80px 1fr' : '250px 1fr'};
  transition: grid-template-columns 0.3s ease;
  height: calc(100vh - 60px);
`;

const Sidebar = styled.div<{ showMobileSidebar: boolean }>`
  background-color: #111;
  border-right: 1px solid #222;
  padding: 20px;
  transition: transform 0.3s ease;
  z-index: 100;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    position: absolute;
    width: 250px;
    left: 0;
    top: 60px;
    transform: ${({ showMobileSidebar }) =>
    showMobileSidebar ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${({ showMobileSidebar }) =>
    showMobileSidebar ? '2px 0 5px rgba(0,0,0,0.5)' : 'none'};
  }

  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  overflow: auto;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;

  @media (max-width: 768px) {
    padding: 10px;
    width: 100vw;
  }
`;

const Dashboard: React.FC<{ user: { firstName: string; lastName: string } }> = ({ user }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Dashboard');

  const showMobileSidebar = useSelector((state: RootState) => state.sidebar.showMobileSidebar);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authService
      .handleUserSignout()
      .then(() => navigate(RoutePath.Login))
      .catch((err) => console.error(err));
  };

  const renderSelectedComponent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <DashboardOverview />;
      case 'Tasks':
        return <TaskList />;
      case 'Profile':
        return <UserProfile />;
      // case 'Calendar':
      //   return <CalendarView />;
      // case 'Notifications':
      //   return <Notifications />;
      case 'Settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardWrapper>
      <Navbar />
      <Main isMenuCollapsed={isMenuCollapsed}>
        <Sidebar showMobileSidebar={showMobileSidebar}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ToggleMenuButton onClick={() => dispatch(toggleMobileSidebar())}>
              {isMenuCollapsed ? '▶' : '◀'}
            </ToggleMenuButton>

            {!isMenuCollapsed && (
              <div style={{ flex: 1 }}>
                {[
                  // @ts-ignore
                  { label: 'Dashboard', icon: <FaTachometerAlt />, key: 'Dashboard' },
                  // @ts-ignore
                  { label: 'Profile', icon: <FaUser />, key: 'Profile' },
                  // @ts-ignore
                  // { label: 'Notifications', icon: <FaUser />, key: 'Notifications' },
                  // @ts-ignore
                  { label: 'Tasks', icon: <FaTasks />, key: 'Tasks' },
                  // @ts-ignore
                  // { label: 'Calendar', icon: <FaCalendarAlt />, key: 'Calendar' },
                  // @ts-ignore
                  { label: 'Settings', icon: <FaCog />, key: 'Settings' },
                ].map((item) => (
                  <MenuItem
                    key={item.key}
                    onClick={() => {
                      setSelectedItem(item.key);
                      if (window.innerWidth <= 768) dispatch(hideSidebar());
                    }}
                    style={{
                      color: selectedItem === item.key ? '#4a90e2' : '#fff',
                      fontWeight: selectedItem === item.key ? 'bold' : 'normal',
                    }}
                  >
                    {React.cloneElement(item.icon, { style: { marginRight: '8px' } })}
                    {item.label}
                  </MenuItem>
                ))}
              </div>
            )}
          </div>

          {!isMenuCollapsed && (
            <div
              style={{
                marginBottom: '0px',
              }}
            >
              <MenuItem
                onClick={handleSignOut}
                style={{
                  color: '#f44336',
                  marginBottom: '0px',
                  marginTop: 'auto',
                }}
              >
                {/* @ts-ignore */}
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                Log Out
              </MenuItem>
            </div>
          )}
        </Sidebar>

        <Content>{renderSelectedComponent()}</Content>
      </Main>
    </DashboardWrapper>
  );
};

export default Dashboard;