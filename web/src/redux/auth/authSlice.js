// redux/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../root/api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    roles: JSON.parse(localStorage.getItem("roles")) || [],
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      state.roles = [];

      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("roles");
    },

    setToken(state, action) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.roles = action.payload.roles;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("roles", JSON.stringify(action.payload.roles));
    },

    loadFromStorage(state) {
      const storedToken = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");
      const storedRoles = localStorage.getItem("roles");

      if (storedToken) state.token = storedToken;
      if (storedUsername) state.username = storedUsername;
      if (storedRoles) state.roles = JSON.parse(storedRoles);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.roles = action.payload.roles || [];
        state.error = null;

        // Save to localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem(
          "roles",
          JSON.stringify(action.payload.roles || []),
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, setToken, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
