import {
  fetchIngredients,
  ingredientsInitialState
} from '../src/services/slices';
import reducer from '../src/services/slices/ingredients/ingredients';

const ingredientsValue = [
  {
    _id: '643d69a5c3f7b9001cfa093e',
    id: '1234567890',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0,
  },
];

describe('Редюсер Ингредиентов', () => {
  describe('Асинхронное действие fetchIngredients', () => {
    test('Устанавливает состояние загрузки, когда запрос в ожидании', () => {
      const state = reducer(
        ingredientsInitialState,
        fetchIngredients.pending('pending')
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    test('Обновляет состояние данными, когда запрос выполнен', () => {
      const state = reducer(
        ingredientsInitialState,
        fetchIngredients.fulfilled(ingredientsValue, 'fulfilled')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.data).toEqual(ingredientsValue);
    });

    test('Устанавливает состояние ошибки, когда запрос отклонен', () => {
      const errorMessage = 'fetchIngredients.rejected';
      const action = fetchIngredients.rejected(
        new Error(errorMessage),
        'rejected'
      );
      const state = reducer(ingredientsInitialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error?.message).toEqual(errorMessage);
    });
  });
});
