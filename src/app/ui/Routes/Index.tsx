import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import Dashboard from '../pages/Dashboard/Dashboard';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import Login from '../pages/LoginPage/LoginPage';
import Register from '../pages/Register/Register';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';

export enum RoutePath {
    Home = "/",
    Register = "/auth/register",
    Login = "/auth/login",
    ForgotPassword = "/auth/forgot-password",
    Dashboard = "/dashboard"
}

const Index: React.FunctionComponent = () => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <Routes>
            <Route
                path={RoutePath.Home}
                element={user.firstName !== "" ? <Navigate to={RoutePath.Dashboard} replace /> : <HomePage />}
            />
            <Route path={RoutePath.Register} element={<Register />} />
            <Route path={RoutePath.Login} element={<Login />} />
            <Route path={RoutePath.ForgotPassword} element={<ForgotPassword />} />
            <Route path={RoutePath.Dashboard} element={<Dashboard user={{
                firstName: user.firstName,
                lastName: user.lastName
            }} />} />
        </Routes>
    )
}

export default Index