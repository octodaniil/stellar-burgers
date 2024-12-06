import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../../utils/burger-api';

import { TUser } from '@utils-types';
import { clearTokens, storeTokens } from '../../../utils/authorization';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginError?: SerializedError;
  registerError?: SerializedError;
  data: TUser;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: {
    name: '',
    email: ''
  }
};

const handleResponse = (response: any, rejectWithValue: Function) => {
  if (!response?.success) {
    return rejectWithValue(response);
  }
  return response;
};

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    const validResponse = handleResponse(response, rejectWithValue);

    if (validResponse) {
      const { user, refreshToken, accessToken } = validResponse;
      storeTokens(refreshToken, accessToken);
      return user;
    }
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    const response = await loginUserApi(data);
    const validResponse = handleResponse(response, rejectWithValue);

    if (validResponse) {
      const { user, refreshToken, accessToken } = validResponse;
      storeTokens(refreshToken, accessToken);
      return user;
    }
  }
);

export const logout = createAsyncThunk<void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    handleResponse(response, rejectWithValue);
    clearTokens();
  }
);

export const fetchUser = createAsyncThunk<TUser>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();
    const validResponse = handleResponse(response, rejectWithValue);
    return validResponse ? validResponse.user : undefined;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    const validResponse = handleResponse(response, rejectWithValue);
    return validResponse ? validResponse.user : undefined;
  }
);

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerError = undefined;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
      })
      .addCase(login.pending, (state) => {
        state.loginError = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.data = {
          email: '',
          name: ''
        };
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export default slice.reducer;
