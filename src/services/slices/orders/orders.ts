import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersState = {
  isOrderLoading: boolean;
  isOrdersLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: SerializedError | null;
  data: TOrder[];
};

export const initialState: TOrdersState = {
  isOrderLoading: true,
  isOrdersLoading: true,
  orderRequest: false,
  orderModalData: null,
  error: null,
  data: []
};

const handleApiResponse = (response: any, rejectWithValue: Function) =>
  response?.success ? response : rejectWithValue(response);

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('orders/create', async (data, { rejectWithValue }) => {
  const response = await orderBurgerApi(data);
  const validResponse = handleApiResponse(response, rejectWithValue);
  return validResponse
    ? { order: validResponse.order, name: validResponse.name }
    : validResponse;
});

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'orders/fetchOrder',
  async (data, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(data);
    const validResponse = handleApiResponse(response, rejectWithValue);
    return validResponse ? validResponse.orders[0] : validResponse;
  }
);

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders',
  getOrdersApi
);

const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.isOrderLoading = false;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const { resetOrderModalData } = slice.actions;

export default slice.reducer;
