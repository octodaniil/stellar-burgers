import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { useSelector } from '@store';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector((state) => state.ingredients.data);

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');
  const sauces = ingredients.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleRefs = {
    bun: useRef<HTMLHeadingElement>(null),
    main: useRef<HTMLHeadingElement>(null),
    sauce: useRef<HTMLHeadingElement>(null)
  };

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewMains] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewMains) {
      setCurrentTab('main');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    }
  }, [inViewBuns, inViewMains, inViewSauces]);

  const onTabClick = (tab: TTabMode | string) => {
    setCurrentTab(tab as TTabMode);
    titleRefs[tab as TTabMode]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleRefs.bun}
      titleMainRef={titleRefs.main}
      titleSaucesRef={titleRefs.sauce}
      bunsRef={bunsRef as any}
      mainsRef={mainsRef as any}
      saucesRef={saucesRef as any}
      onTabClick={onTabClick}
    />
  );
};
