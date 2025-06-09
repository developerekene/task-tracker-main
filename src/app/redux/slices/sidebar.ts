import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
    showMobileSidebar: boolean;
}

const initialState: SidebarState = {
    showMobileSidebar: false,
};

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleMobileSidebar(state) {
            state.showMobileSidebar = !state.showMobileSidebar;
        },
        showSidebar(state) {
            state.showMobileSidebar = true;
        },
        hideSidebar(state) {
            state.showMobileSidebar = false;
        },
    },
});

export const { toggleMobileSidebar, showSidebar, hideSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
