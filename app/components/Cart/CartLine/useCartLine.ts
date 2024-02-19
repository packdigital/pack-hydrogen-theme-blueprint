import {useCallback, useEffect, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

export const useCartLine = ({line}: {line: CartLine}) => {
  const {id, quantity} = {...line};
  const {linesRemove, linesUpdate, status} = useCart();

  const [isUpdatingLine, setIsUpdatingLine] = useState(false);
  const [isRemovingLine, setIsRemovingLine] = useState(false);

  const handleDecrement = useCallback(() => {
    if (quantity > 1) {
      setIsUpdatingLine(true);
      linesUpdate([{id, quantity: quantity - 1}]);
    } else {
      linesRemove([id]);
    }
  }, [id, linesRemove, linesUpdate, quantity, status]);

  const handleIncrement = useCallback(() => {
    setIsUpdatingLine(true);
    linesUpdate([{id, quantity: quantity + 1}]);
  }, [id, linesUpdate, quantity, status]);

  const handleRemove = useCallback(() => {
    setIsRemovingLine(true);
    linesRemove([id]);
  }, [id, linesRemove, status]);

  useEffect(() => {
    if (isUpdatingLine && status === 'idle') {
      setIsUpdatingLine(false);
    }
    if (isRemovingLine && status === 'idle') {
      setIsRemovingLine(false);
    }
  }, [status, isRemovingLine, isUpdatingLine]);

  return {
    handleDecrement,
    handleIncrement,
    handleRemove,
    isRemovingLine,
    isUpdatingLine,
  };
};
