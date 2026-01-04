import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Toast } from '../../types';

const initialState: UIState = {
    toasts: [],
    viewMode: 'map',
    searchQuery: '',
    sortBy: 'date_desc',
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            const id = Date.now().toString();
            state.toasts.push({ ...action.payload, id });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
        setViewMode: (state, action: PayloadAction<'map' | 'list'>) => {
            state.viewMode = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setSortBy: (state, action: PayloadAction<string>) => {
            state.sortBy = action.payload;
        },
    },
});

export const { addToast, removeToast, setViewMode, setSearchQuery, setSortBy } = uiSlice.actions;

export default uiSlice.reducer;
