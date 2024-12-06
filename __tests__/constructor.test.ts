import {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  constructorInitialState
} from '../src/services/slices';
import reducer from '../src/services/slices/constructor/constructor';
const bunValue = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0
};
const firstIngredientValue = {
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
  __v: 0
};
const secondIngredientsValue = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '0987654321',
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
  __v: 0
};

interface ConstructorState {
  bun: typeof bunValue | null;
  ingredients: (typeof firstIngredientValue)[];
}

describe('Тестирование builderReducer', () => {
  let initialState: ConstructorState;

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: []
    };
  });

  describe('Работа с хлебом', () => {
    test('Установка хлеба через setBun', () => {
      const state = reducer(initialState, setBun(bunValue));
      expect(state.bun).toEqual(bunValue);
      expect(state.ingredients).toHaveLength(0);
    });

    test('Установка хлеба через addIngredient', () => {
      const state = reducer(initialState, addIngredient(bunValue));
      expect(state.bun).toEqual(expect.objectContaining(bunValue));
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Работа с ингридиентами', () => {
    test('Добавление ингредиента', () => {
      const state = reducer(
        constructorInitialState,
        addIngredient(firstIngredientValue)
      );
      expect(state.ingredients).toHaveLength(1);
      const updatedObject = { ...state.ingredients[0] } as Record<string, any>;
      delete updatedObject.id;
      const initialObject = { ...firstIngredientValue } as Record<string, any>;
      delete initialObject.id;
      expect(updatedObject).toEqual(initialObject);
      expect(state.bun).toBeNull();
    });

    test('Удаление ингредиента', () => {
      const initialStateWithIngredients: ConstructorState = {
        bun: null,
        ingredients: [firstIngredientValue, secondIngredientsValue]
      };
      const state = reducer(
        initialStateWithIngredients,
        removeIngredient(firstIngredientValue.id)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(secondIngredientsValue);
      expect(state.bun).toBeNull();
    });

    describe('Передвижение ингредиентов', () => {
      const setUpInitialIngredients = (): ConstructorState => ({
        bun: null,
        ingredients: [firstIngredientValue, secondIngredientsValue]
      });

      test('Передвижение вниз', () => {
        const state = reducer(
          setUpInitialIngredients(),
          moveIngredient({ index: 0, upwards: false })
        );
        expect(state.ingredients).toEqual([
          secondIngredientsValue,
          firstIngredientValue
        ]);
        expect(state.bun).toBeNull();
      });

      test('Передвижение вверх', () => {
        const _initialState = {
          bun: null,
          ingredients: [firstIngredientValue, secondIngredientsValue]
        };
        const state = reducer(
          _initialState,
          moveIngredient({ index: 1, upwards: true })
        );
        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients[0]).toEqual(secondIngredientsValue);
        expect(state.ingredients[1]).toEqual(firstIngredientValue);
        expect(state.bun).toBeNull();
      });
    });
  });

  test('Очистка конструктора', () => {
    const _initialState: ConstructorState = {
      bun: bunValue,
      ingredients: [firstIngredientValue, secondIngredientsValue]
    };
    const state = reducer(_initialState, resetConstructor());
    expect(state.ingredients).toHaveLength(0);
    expect(state.bun).toBeNull();
  });
});
