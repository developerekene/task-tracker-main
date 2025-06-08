// redux/slices/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { error } from 'console';

export interface Task {
    id: string;
    title: string;
    desc: string;
    completed?: boolean;
    dateCreated?: string;
    dateModified?: string;
    dateDeleted?: string;
}

// Helper to load from localStorage
const loadTasksFromStorage = (): Task[] => {
    try {
        const data = localStorage.getItem('tasks');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// Helper to save to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (err) {
        // Handle storage errors silently
        console.log(err)
    }
};

const initialState: Task[] = loadTasksFromStorage();

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
            saveTasksToStorage(action.payload);
            return action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            const updated = [...state, action.payload];
            saveTasksToStorage(updated);
            return updated;
        },
        updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
            const updated = state.map(task =>
                task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
            );
            saveTasksToStorage(updated);
            return updated;
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            const updated = state.filter(task => task.id !== action.payload);
            saveTasksToStorage(updated);
            return updated;
        },
    },
});

export const { setTasks, addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;