import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../redux/store';
import { toggleMobileSidebar } from '../../redux/slices/sidebar';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  height: 60px;

  @media (max-width: 768px) {
    display: flex;
}
`;
const HeaderOne = styled.header`
    font-size: 1.5rem; 
    color: #4a90e2; 
    margin: 0;
    font-weight: 900;

    @media (max-width: 768px) {
        color: #4a90e2; 
        font-size: 1rem; 
        font-weight: 900
    }
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

  @media (max-width: 768px) {
    display: none;
}
`;

const WelcomeGreeting = styled.div`
    margin: 0;
    font-size: 1rem;
    color: #cccccc;

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const DropDown = styled.div`
    display: none;

  @media (max-width: 768px) {
    display: block;
    color: #ffffff;
    font-size: 20px
}
`;

const Navbar: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };
    return (
        <Header>
            <HeaderOne>Task Tracker</HeaderOne>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
                {user.firstName && (<>
                    <WelcomeGreeting>
                        {getGreeting()}, {user.firstName}
                    </WelcomeGreeting>
                    <InitialsBadge>{user.initials}</InitialsBadge>
                    <DropDown onClick={() => store.dispatch(toggleMobileSidebar())}>=</DropDown>
                </>)}
            </div>
        </Header>
    )
}

export default Navbar