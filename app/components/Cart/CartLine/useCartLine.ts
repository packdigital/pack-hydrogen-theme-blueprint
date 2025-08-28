import {useCallback, useEffect, useMemo, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

export const useCartLine = ({line}: {line: CartLine}) => {
  const {id, merchandise, quantity} = {...line};
  const {linesRemove, linesUpdate, status} = useCart();

  const [isUpdatingLine, setIsUpdatingLine] = useState(false);
  const [isRemovingLine, setIsRemovingLine] = useState(false);

  const {increment = 1, minimum = 1, maximum} = {...merchandise.quantityRule};

  const {disableDecrement, disableIncrement} = useMemo(() => {
    const nextIncrement = increment - (quantity % increment);
    const prevIncrement =
      quantity % increment === 0 ? increment : quantity % increment;
    const prevQuantity = Number(
      Math.max(0, quantity - prevIncrement).toFixed(0),
    );
    const nextQuantity = Number((quantity + nextIncrement).toFixed(0));
    return {
      disableDecrement: minimum > 1 && prevQuantity < minimum,
      disableIncrement: Boolean(maximum && nextQuantity > maximum),
    };
  }, [increment, minimum, maximum, quantity, merchandise?.id]);

  const handleDecrement = useCallback(() => {
    if (disableDecrement) return;
    if (quantity > 1) {
      setIsUpdatingLine(true);
      linesUpdate([{id, quantity: quantity - increment}]);
    } else {
      linesRemove([id]);
    }
  }, [
    disableDecrement,
    id,
    increment,
    linesRemove,
    linesUpdate,
    quantity,
    status,
  ]);

  const handleIncrement = useCallback(() => {
    if (disableIncrement) return;
    setIsUpdatingLine(true);
    linesUpdate([{id, quantity: quantity + increment}]);
  }, [disableIncrement, id, linesUpdate, quantity, status]);

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
    disableDecrement,
    disableIncrement,
    handleDecrement,
    handleIncrement,
    handleRemove,
    isRemovingLine,
    isUpdatingLine,
  };
};
