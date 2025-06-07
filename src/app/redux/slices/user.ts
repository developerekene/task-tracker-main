// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    isLoggedIn: boolean;
    initials: string;
    uniqueId: string;
    agreedToTerms: string;
    middleName: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    disability: boolean;
    disabilityType: string;
    photoUrl: string;
    educationalLevel: string;
    referralName: string;
    secondaryEmail: string;
    securityQuestion: string;
    securityAnswer: string;
    verifiedEmail: boolean;
    verifyPhoneNumber: boolean;
    twoFactorSettings: boolean;
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    country: string;
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
        isLoggedIn: false,
        initials: "",
        uniqueId: "",
        agreedToTerms: "",
        middleName: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        disability: false,
        disabilityType: "",
        photoUrl: "",
        educationalLevel: "",
        referralName: "",
        secondaryEmail: "",
        securityQuestion: "",
        securityAnswer: "",
        verifiedEmail: false,
        verifyPhoneNumber: false,
        twoFactorSettings: false,
        streetNumber: "",
        streetName: "",
        city: "",
        state: "",
        country: "",
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
                initials: "",
                uniqueId: "",
                agreedToTerms: "",
                middleName: "",
                phone: "",
                gender: "",
                dateOfBirth: "",
                disability: false,
                disabilityType: "",
                photoUrl: "",
                educationalLevel: "",
                referralName: "",
                secondaryEmail: "",
                securityQuestion: "",
                securityAnswer: "",
                verifiedEmail: false,
                verifyPhoneNumber: false,
                twoFactorSettings: false,
                streetNumber: "",
                streetName: "",
                city: "",
                state: "",
                country: "",
            };
        },
    },
});

export const { setUserData, resetUserData } = userSlice.actions;
export default userSlice.reducer;