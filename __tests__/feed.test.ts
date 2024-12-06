import { fetchFeeds, feedsInitialState } from '../src/services/slices';
import reducer from '../src/services/slices/feeds/feeds';

const feedsValue = {
  orders: [],
  total: 1,
  totalToday: 1
};

describe('Редюсер Feeds', () => {
  describe('Асинхронное действие fetchFeeds', () => {
    test('Устанавливает состояние загрузки, когда запрос в ожидании', () => {
      const state = reducer(feedsInitialState, fetchFeeds.pending('pending'));

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    test('Обновляет состояние данными, когда запрос выполнен', () => {
      const state = reducer(
        feedsInitialState,
        fetchFeeds.fulfilled(feedsValue, 'fulfilled')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.data).toEqual(feedsValue);
    });

    test('Устанавливает состояние ошибки, когда запрос отклонен', () => {
      const errorMessage = 'fetchFeeds.rejected';
      const action = fetchFeeds.rejected(new Error(errorMessage), 'rejected');
      const state = reducer(feedsInitialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error?.message).toEqual(errorMessage);
    });
  });
});
