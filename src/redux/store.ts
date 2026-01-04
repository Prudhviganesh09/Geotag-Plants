import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import userReducer from './slices/userSlice';
import uploadReducer from './slices/uploadSlice';
import uiReducer from './slices/uiSlice';
import { plantApi } from '../services/plantApi';

export const store = configureStore({
    reducer: {
        user: userReducer,
        upload: uploadReducer,
        ui: uiReducer,
        [plantApi.reducerPath]: plantApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['upload/addToQueue', 'upload/updateUploadStatus', 'ui/addToast', 'ui/removeToast', 'plantApi/executeQuery/fulfilled', 'plantApi/executeQuery/rejected', 'plantApi/executeQuery/pending'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.file', 'meta.arg', 'payload', 'upload.queue.file', 'meta.baseQueryMeta'],
                // Ignore these paths in the state
                ignoredPaths: ['upload.queue', 'ui.toasts'],
            },
        }).concat(plantApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
