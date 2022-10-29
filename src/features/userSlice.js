// features/userSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {TRYVESTOR} from "../UserTypes";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
    },
    reducers: {
        login: (state, action) => {
            state.user = {
                userType: action.payload.userType,
                uid: action.payload.uid,
                data: action.payload.data
            }
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { login, logout } = userSlice.actions;

// selectors
export const selectUser = (state) => state?.user?.user;
export const selectUserType = (state) => state?.user?.user?.userType;

export default userSlice.reducer;
