// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import sidebar, { sidebarSlice } from './slices/sidebar';
import { taskSlice } from './slices/task';
import { userSlice } from './slices/user';

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        tasks: taskSlice.reducer,
        sidebar: sidebarSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;