import { getIngredientsApi } from '../../../utils/burger-api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  isLoading: boolean;
  error: SerializedError | null;
  data: TIngredient[];
};

export const initialState: TIngredientsState = {
  isLoading: true,
  error: null,
  data: []
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetch',
  getIngredientsApi
);

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export default slice.reducer;
