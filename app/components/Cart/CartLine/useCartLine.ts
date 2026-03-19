import {useCallback, useState} from 'react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {useCart} from '~/hooks';

export const useCartLine = ({line}: {line: CartLine}) => {
  const {id, quantity} = {...line};
  const {linesRemove, linesUpdate} = useCart();

  const [isUpdatingLine, setIsUpdatingLine] = useState(false);
  const [isRemovingLine, setIsRemovingLine] = useState(false);

  const handleDecrement = useCallback(async () => {
    if (quantity > 1) {
      setIsUpdatingLine(true);
      await linesUpdate([{id, quantity: quantity - 1}]);
      setIsUpdatingLine(false);
    } else {
      setIsRemovingLine(true);
      await linesRemove([id]);
      setIsRemovingLine(false);
    }
  }, [id, linesRemove, linesUpdate, quantity]);

  const handleIncrement = useCallback(async () => {
    setIsUpdatingLine(true);
    await linesUpdate([
      {
        id,
        quantity: quantity + 1,
      },
    ]);
    setIsUpdatingLine(false);
  }, [id, linesUpdate, quantity]);

  const handleRemove = useCallback(async () => {
    setIsRemovingLine(true);
    await linesRemove([id]);
    setIsRemovingLine(false);
  }, [id, linesRemove]);

  return {
    handleDecrement,
    handleIncrement,
    handleRemove,
    isRemovingLine,
    isUpdatingLine,
  };
};
