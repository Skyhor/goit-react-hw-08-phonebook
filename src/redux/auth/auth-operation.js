import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
axios.defaults.baseURL = 'https://connections-api.herokuapp.com';
const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset(token) {
    axios.defaults.headers.common.Authorization = '';
  },
};
export const register = createAsyncThunk(
  'auth/register',
  async (contactData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/users/signup', contactData);
      token.set(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const login = createAsyncThunk(
  'auth/login',
  async (contactData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/users/login', contactData);
      token.set(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('/users/logout');
      token.unset();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchCurrentUser = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue, getState }) => {
    const tokenLS = getState().auth.token;
    if (!tokenLS) {
      return rejectWithValue();
    }
    token.set(tokenLS);
    try {
      const { data } = await axios('/users/current');
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
