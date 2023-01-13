// features/userSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {TRYVESTOR} from "../UserTypes";
import {apiTryvestors} from "../utils/api/api-tryvestors";

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
        refreshUserData: (state) => {
            const uid = state?.user?.user.uid
            apiTryvestors.getSingle(uid).then(userData => {
                userData = new Map(Object.entries(userData))
                state.user = {
                    userType: TRYVESTOR,
                    uid,
                    data: userData
                }
            })
        },
    },
});
// refresh
export const { login, logout, refreshUserData } = userSlice.actions;

// selectors
export const selectUser = (state) => state?.user?.user;
export const selectUserType = (state) => state?.user?.user?.userType;

export default userSlice.reducer;
