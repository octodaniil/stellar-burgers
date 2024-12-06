import {
  fetchOrder,
  fetchOrders,
  createOrder,
  resetOrderModalData,
  ordersInitialState
} from '../src/services/slices';

import reducer from '../src/services/slices/orders/orders';

const ordersValue = [
  {
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa0945'
    ],
    _id: '6752109fe367de001daf72bf',
    status: 'done',
    name: 'EXAMPLE_NAME',
    createdAt: '2024-12-05T20:44:15.281Z',
    updatedAt: '2024-12-05T20:44:16.136Z',
    number: 61705
  }
];

describe('Редюсер Заказов', () => {
  test('Сбрасывает данные модального окна заказа', () => {
    const initialState = {
      isOrderLoading: true,
      isOrdersLoading: true,
      orderRequest: false,
      orderModalData: ordersValue[0],
      error: null,
      data: [],
    };

    const state = reducer(initialState, resetOrderModalData());

    expect(state.orderModalData).toBeNull();
    expect(state.data).toHaveLength(0);
    expect(state.error).toBeNull();
    expect(state.orderRequest).toBe(false);
    expect(state.isOrdersLoading).toBe(true);
    expect(state.isOrderLoading).toBe(true);
  });

  describe('Асинхронное действие fetchOrders', () => {
    test('Устанавливает состояние загрузки, когда запрос в ожидании', () => {
      const state = reducer(ordersInitialState, fetchOrders.pending('pending'));

      expect(state.isOrdersLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обновляет состояние данными, когда запрос выполнен', () => {
      const state = reducer(
        ordersInitialState,
        fetchOrders.fulfilled(ordersValue, 'fulfilled')
      );

      expect(state.isOrdersLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(ordersValue);
    });

    test('Устанавливает состояние ошибки, когда запрос отклонен', () => {
      const errorMessage = 'fetchOrders.rejected';

      const state = reducer(
        ordersInitialState,
        fetchOrders.rejected(new Error(errorMessage), 'rejected')
      );

      expect(state.isOrdersLoading).toBe(false);
      expect(state.error?.message).toEqual(errorMessage);
    });
  });

  describe('Асинхронное действие fetchOrder', () => {
    test('Устанавливает состояние загрузки, когда запрос в ожидании', () => {
      const state = reducer(
        ordersInitialState,
        fetchOrder.pending('pending', ordersValue[0].number)
      );

      expect(state.isOrderLoading).toBe(true);
    });

    test('Обновляет состояние данными заказа, когда запрос выполнен', () => {
      const state = reducer(
        ordersInitialState,
        fetchOrder.fulfilled(ordersValue[0], 'fulfilled', ordersValue[0].number)
      );

      expect(state.isOrderLoading).toBe(false);
      expect(state.orderModalData).toEqual(ordersValue[0]);
    });

    test('Обрабатывает состояние ошибки, когда запрос отклонен', () => {
      const errorMessage = 'fetchOrder.rejected';

      const state = reducer(
        ordersInitialState,
        fetchOrder.rejected(new Error(errorMessage), 'rejected', -1)
      );

      expect(state.isOrderLoading).toBe(false);
    });
  });

  describe('Асинхронное действие createOrder', () => {
    test('Устанавливает orderRequest в true, когда запрос в ожидании', () => {
      const state = reducer(
        ordersInitialState,
        createOrder.pending('pending', ordersValue[0].ingredients)
      );

      expect(state.orderRequest).toBe(true);
    });

    test('Обновляет состояние данными заказа, когда запрос выполнен', () => {
      const state = reducer(
        ordersInitialState,
        createOrder.fulfilled(
          { order: ordersValue[0], name: 'EXAMPLE' },
          'fulfilled',
          ordersValue[0].ingredients
        ));

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(ordersValue[0]);
    });

    test('Обрабатывает состояние ошибки, когда запрос отклонен', () => {
      const errorMessage = 'createOrder.rejected';

      const state = reducer(
        ordersInitialState,
        createOrder.rejected(new Error(errorMessage), 'rejected', [])
      );

      expect(state.orderRequest).toBe(false);
    });
  });
});

