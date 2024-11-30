import { FC, useEffect, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '@store';
import { OrderInfoUI, Preloader } from '@ui';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '@slices';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const { isLoading: isIngredientsLoading, data: ingredients } = useSelector(
    (state) => state.ingredients
  );
  const { isOrderLoading, orderModalData: orderData } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrder(Number(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          acc[item] = acc[item]
            ? { ...acc[item], count: acc[item].count + 1 }
            : { ...ingredient, count: 1 };
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isIngredientsLoading || isOrderLoading) {
    return <Preloader />;
  }

  return orderInfo ? <OrderInfoUI orderInfo={orderInfo} /> : null;
};
