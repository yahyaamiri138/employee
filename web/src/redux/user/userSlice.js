import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../root/api";

const API_URL = "users";

// Fetch all users
export const fetchUsers = createAsyncThunk("user/fetchAll", async () => {
  const res = await api.get(API_URL);
  return res.data;
});

// Fetch single user by ID
// export const fetchUserById = createAsyncThunk("user/fetchById", async (id) => {
//   const res = await api.get(`${API_URL}/${id}`);
//   return res.data;
// });
export const fetchUserById = createAsyncThunk("user/fetchById", async (id) => {
  const res = await api.get(`${API_URL}/id/${id}`);
  return res.data;
});

// Create new user
export const createUser = createAsyncThunk("user/create", async (user) => {
  const res = await api.post(`${API_URL}/register`, {
    ...user,
    roles: user.roles || ["ROLE_USER"], // Default role if none selected
  });
  return res.data;
});

// Update user
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, user }) => {
    const res = await api.put(`${API_URL}/${id}`, user);
    return res.data;
  },
);

// Delete user
export const deleteUser = createAsyncThunk("user/delete", async (id) => {
  await api.delete(`${API_URL}/delete/${id}`);
  return id;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
