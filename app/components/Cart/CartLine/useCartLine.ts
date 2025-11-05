import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import debounce from 'lodash/debounce';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {useCart} from '~/hooks';

export const useCartLine = ({line}: {line: CartLine}) => {
  const {id, quantity} = {...line};
  const {linesRemove, linesUpdate, status} = useCart();

  const [optimisticQuantity, setOptimisticQuantity] = useState(quantity);

  /*
   * Optimistic quantity debounce logic
   */
  const handleDebouncedDecrement = useCallback(async () => {
    if (optimisticQuantity > 0) {
      const data = await linesUpdate([{id, quantity: optimisticQuantity}]);
      if (data && !data.cart) setOptimisticQuantity(quantity);
    } else {
      const data = await linesRemove([id]);
      if (data && !data.cart) setOptimisticQuantity(quantity);
    }
  }, [id, linesRemove, linesUpdate, optimisticQuantity, quantity, status]);

  const handleDebouncedIncrement = useCallback(async () => {
    const data = await linesUpdate([{id, quantity: optimisticQuantity}]);
    if (data && !data.cart) setOptimisticQuantity(quantity);
  }, [id, linesUpdate, optimisticQuantity, quantity, status]);

  const debouncedDecrementRef = useRef(handleDebouncedDecrement);
  const debouncedIncrementRef = useRef(handleDebouncedIncrement);

  useEffect(() => {
    debouncedDecrementRef.current = handleDebouncedDecrement;
    debouncedIncrementRef.current = handleDebouncedIncrement;
  }, [handleDebouncedDecrement, handleDebouncedIncrement]);

  const doDecrementCallbackWithDebounce = useMemo(() => {
    const callback = () => debouncedDecrementRef.current();
    return debounce(callback, 200);
  }, []);

  const doIncrementCallbackWithDebounce = useMemo(() => {
    const callback = () => debouncedIncrementRef.current();
    return debounce(callback, 200);
  }, []);

  /*
   * Cart line handlers
   */
  const handleDecrement = useCallback(() => {
    if (optimisticQuantity > 0) {
      doDecrementCallbackWithDebounce();
      setOptimisticQuantity(optimisticQuantity - 1);
    } else {
      setOptimisticQuantity(0);
      linesRemove([id]);
    }
  }, [doDecrementCallbackWithDebounce, id, linesRemove, optimisticQuantity]);

  const handleIncrement = useCallback(() => {
    doIncrementCallbackWithDebounce();
    setOptimisticQuantity(optimisticQuantity + 1);
  }, [doIncrementCallbackWithDebounce, optimisticQuantity]);

  const handleRemove = useCallback(async () => {
    setOptimisticQuantity(0);
    const data = await linesRemove([id]);
    if (data && !data.cart) setOptimisticQuantity(quantity);
  }, [id, linesRemove, quantity, status]);

  return {
    handleDecrement,
    handleIncrement,
    handleRemove,
    optimisticQuantity,
  };
};
