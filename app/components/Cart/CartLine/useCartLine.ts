import {useCallback, useEffect, useState} from 'react';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {useCartContext} from '~/contexts/CartProvider/useCartContext';
import {useCart, useRootLoaderData} from '~/hooks';

export const useCartLine = ({line}: {line: CartLine}) => {
  const {id, quantity} = {...line};
  const {isPreviewModeEnabled} = useRootLoaderData();
  const {adjustLineQuantity, flushPendingCartUpdates, setLineQuantity, status} =
    useCart();
  const {
    state: {optimisticLines},
  } = useCartContext();

  // Non-preview: per-line optimistic hint — dim just the edited line (buttons
  // stay live) while its debounced change is pending/in flight.
  const isSyncingLine = !isPreviewModeEnabled && !!optimisticLines[id];

  // Preview mode has no optimistic overlay (the customizer cart mutates the
  // server immediately), so show the spinner while the update is in flight,
  // keyed off the client cart status returning to 'idle'.
  const [isUpdatingLine, setIsUpdatingLine] = useState(false);
  useEffect(() => {
    if (status === 'idle') setIsUpdatingLine(false);
  }, [status]);

  // Relative adjust reads the freshest pending quantity internally, so holding
  // down +/- accumulates freely without waiting for each re-render. `quantity`
  // is only the fallback base when nothing is pending. A resulting 0 is routed
  // to a line removal.
  const handleDecrement = useCallback(() => {
    if (isPreviewModeEnabled) setIsUpdatingLine(true);
    adjustLineQuantity(id, -1, quantity);
  }, [adjustLineQuantity, id, isPreviewModeEnabled, quantity]);

  const handleIncrement = useCallback(() => {
    if (isPreviewModeEnabled) setIsUpdatingLine(true);
    adjustLineQuantity(id, 1, quantity);
  }, [adjustLineQuantity, id, isPreviewModeEnabled, quantity]);

  const handleRemove = useCallback(() => {
    if (isPreviewModeEnabled) setIsUpdatingLine(true);
    // Removing via the X is a deliberate action — apply it immediately rather
    // than waiting out the debounce window (no-op debounce in preview).
    setLineQuantity(id, 0);
    void flushPendingCartUpdates();
  }, [flushPendingCartUpdates, id, isPreviewModeEnabled, setLineQuantity]);

  return {
    handleDecrement,
    handleIncrement,
    handleRemove,
    // Preview: spinner + disabled buttons while the server mutation runs.
    // Non-preview: dim only, buttons stay live for rapid optimistic clicks.
    isSyncingLine,
    isUpdatingLine: isPreviewModeEnabled && isUpdatingLine,
  };
};
