import {
  login,
  logout,
  userInitialState,
  fetchUser,
  updateUser,
  register
} from '../src/services/slices';

import reducer from '../src/services/slices/user/user';

const userValue = {
  email: 'example@example.mail',
  name: 'Example'
};

const loginValue = {
  email: 'example@example.mail',
  password: 'Example'
};

const registerValue = {
  email: 'example@example.mail',
  name: 'Example',
  password: 'Example'
};

describe('Тесты редюсера Пользователя', () => {
  describe('Асинхронная регистрация: register', () => {
    test('Устанавливает начальное состояние, когда запрос в ожидании', () => {
      const state = reducer(
        userInitialState,
        register.pending('pending', registerValue)
      );
      expect(state.registerError).toBeUndefined();
    });

    test('Обновляет состояние при успешной регистрации', () => {
      const state = reducer(
        userInitialState,
        register.fulfilled(userValue, 'fulfilled', registerValue)
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.registerError).toBeUndefined();
      expect(state.data).toEqual(userValue);
    });

    test('Обрабатывает ошибку, когда регистрация отклонена', () => {
      const errorMessage = 'register.rejected';
      const state = reducer(
        userInitialState,
        register.rejected(new Error(errorMessage), 'rejected', registerValue)
      );
      expect(state.registerError?.message).toEqual(errorMessage);
    });
  });

  describe('Асинхронный вход в систему: login', () => {
    test('Устанавливает начальное состояние, когда запрос в ожидании', () => {
      const state = reducer(
        userInitialState,
        login.pending('pending', loginValue)
      );
      expect(state.loginError).toBeUndefined();
    });

    test('Обновляет состояние при успешном входе', () => {
      const state = reducer(
        userInitialState,
        login.fulfilled(userValue, 'fulfilled', loginValue)
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginError).toBeUndefined();
      expect(state.data).toEqual(userValue);
    });

    test('Обрабатывает ошибку, когда вход в систему отклонен', () => {
      const errorMessage = 'login.rejected';
      const state = reducer(
        userInitialState,
        login.rejected(new Error(errorMessage), 'rejected', loginValue)
      );
      expect(state.loginError?.message).toEqual(errorMessage);
    });
  });

  describe('Асинхронный выход из системы: logout', () => {
    test('Сбрасывает состояние аутентификации при успешном выходе', () => {
      const state = reducer(
        userInitialState,
        logout.fulfilled(undefined, 'fulfilled')
      );
      expect(state.isAuthenticated).toBe(false);
      expect(state.data).toEqual({ email: '', name: '' });
    });
  });

  describe('Асинхронное получение пользователя: fetchUser', () => {
    test('Обновляет состояние, когда пользователь получен', () => {
      const state = reducer(
        userInitialState,
        fetchUser.fulfilled(userValue, 'fulfilled')
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.data).toEqual(userValue);
    });

    test('Обрабатывает ошибку, когда получение пользователя отклонено', () => {
      const errorMessage = 'fetchUser.rejected';
      const state = reducer(
        userInitialState,
        fetchUser.rejected(new Error(errorMessage), 'rejected')
      );
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('Асинхронное обновление пользователя: updateUser', () => {
    test('Обновляет данные пользователя, когда запрос выполнен', () => {
      const state = reducer(
        userInitialState,
        updateUser.fulfilled(userValue, 'fulfilled', userValue)
      );
      expect(state.data).toEqual(userValue);
    });
  });
});
