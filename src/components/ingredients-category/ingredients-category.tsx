import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '@store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: burgerIngredients } = useSelector(
    (state) => state.builder
  );

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = burgerIngredients.reduce(
      (acc, ingredient: TIngredient) => {
        acc[ingredient._id] = (acc[ingredient._id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [burgerIngredients, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
