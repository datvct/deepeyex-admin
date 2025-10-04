import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Doctor } from "../../modules/doctors/types/doctor";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  role: string | null;
  doctor: Doctor | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  role: null,
  doctor: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        userId: string;
        role: string;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
    },
    setDoctor: (state, action: PayloadAction<Doctor>) => {
      state.doctor = action.payload;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.role = null;
      state.doctor = null;
    },
  },
});

export const { setTokens, clearTokens, setDoctor } = authSlice.actions;
export default authSlice.reducer;
