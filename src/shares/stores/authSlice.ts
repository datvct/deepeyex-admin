import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  role: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  role: null,
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
    // setPatient: (state, action: PayloadAction<PatientInfo>) => {
    //   state.patient = action.payload;
    // },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.role = null;
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
