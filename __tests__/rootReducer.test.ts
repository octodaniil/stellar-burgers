import { rootReducer, store } from '../src/services/store';

describe('Тесты корневого редюсера', () => {
  test('Возвращает предыдущее состояние при вызове с UNKNOWN_ACTION и undefined', () => {
    const initialState = store.getState();
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual(initialState);
  });
});
