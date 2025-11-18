// import { AuthState } from "@/utils/types";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const initialState: AuthState = {
//   status: "idle",
//   isAuthenticated: false,
//   error: null,
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuth: (
//       state,
//       action: PayloadAction<{
//         user: any;
//       }>
//     ) => {
//       state.isAuthenticated = true;
//       state.user = action.payload.user;
//       state.error = null;
//     },

//     clearAuth: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.error = null;
//     },

//     setError: (state, action: PayloadAction<string>) => {
//       state.error = action.payload;
//     },

//     clearError: (state) => {
//       state.error = null;
//     },
//   },
// });

// export const { clearError, setAuth, clearAuth, setError } = authSlice.actions;
// export default authSlice.reducer;
