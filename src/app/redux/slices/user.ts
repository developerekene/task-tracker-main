// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    isLoggedIn: boolean;
}

// 🔁 Load user from localStorage if available
const loadFromLocalStorage = (): UserState => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isLoggedIn: false
    };
};

const initialState: UserState = loadFromLocalStorage();

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state: any, action: PayloadAction<Partial<UserState>>) => {
            const newState = { ...state, ...action.payload };
            localStorage.setItem('user', JSON.stringify(newState));
            return newState;
        },
        resetUserData: () => {
            localStorage.removeItem('user');
            return {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                isLoggedIn: false,
            };
        },
    },
});

export const { setUserData, resetUserData } = userSlice.actions;
export default userSlice.reducer;