import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../../types';

const initialState: UserState = {
    emailId: localStorage.getItem('user_email') || null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserEmail: (state, action: PayloadAction<string>) => {
            state.emailId = action.payload;
            localStorage.setItem('user_email', action.payload);
        },
        logout: (state) => {
            state.emailId = null;
            localStorage.removeItem('user_email');
        },
    },
});

export const { setUserEmail, logout } = userSlice.actions;

export default userSlice.reducer;
