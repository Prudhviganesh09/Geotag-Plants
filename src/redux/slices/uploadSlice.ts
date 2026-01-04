import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadItem } from '../../types';

interface UploadState {
    queue: UploadItem[];
}

const initialState: UploadState = {
    queue: [],
};

export const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        addToQueue: (state, action: PayloadAction<UploadItem[]>) => {
            state.queue.push(...action.payload);
        },
        updateUploadStatus: (state, action: PayloadAction<{ id: string; status: UploadItem['status']; error?: string, progress?: number }>) => {
            const item = state.queue.find((i) => i.id === action.payload.id);
            if (item) {
                item.status = action.payload.status;
                if (action.payload.error) item.error = action.payload.error;
                if (action.payload.progress !== undefined) item.progress = action.payload.progress;
            }
        },
        updateUploadData: (state, action: PayloadAction<{ id: string; imageUrl?: string; lat?: number; lng?: number }>) => {
            const item = state.queue.find((i) => i.id === action.payload.id);
            if (item) {
                if (action.payload.imageUrl) item.imageUrl = action.payload.imageUrl;
                if (action.payload.lat) item.lat = action.payload.lat;
                if (action.payload.lng) item.lng = action.payload.lng;
            }
        },
        clearCompleted: (state) => {
            state.queue = state.queue.filter(item => item.status !== 'saved');
        },
        removeFromQueue: (state, action: PayloadAction<string>) => {
            state.queue = state.queue.filter(item => item.id !== action.payload);
        }
    },
});

export const { addToQueue, updateUploadStatus, updateUploadData, clearCompleted, removeFromQueue } = uploadSlice.actions;

export default uploadSlice.reducer;
