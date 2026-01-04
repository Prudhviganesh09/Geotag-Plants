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
        getDefaultMiddleware().concat(plantApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
