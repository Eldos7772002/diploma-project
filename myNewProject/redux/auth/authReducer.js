import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        avatar: null,
        login: null,
        email: null,
        stateChange: false,
        tabBarHidden: true,
    },
    reducers: {
    updateUserProfile: (state, { payload }) => ({
        ...state,
        userId: payload.userId,
        login: payload.login,
        avatar: payload.avatar,
        }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => state,
    },
})

export const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;
export const authReducer = authSlice.reducer;