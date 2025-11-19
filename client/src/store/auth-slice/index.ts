import { AuthState, User } from "@/utils/types/authTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  status: "idle",
  isAuthenticated: false,
  error: null,
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken?: string;
        refreshToken?: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError, setAuth, clearAuth, setError } = authSlice.actions;
export default authSlice.reducer;
