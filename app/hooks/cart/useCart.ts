import {useCallback} from 'react';
import {CartForm, flattenConnection, useAnalytics} from '@shopify/hydrogen';
import {useCart as useClientSideCart} from '@shopify/hydrogen-react';
import type {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';

import {useCartContext} from '~/contexts/CartProvider/useCartContext';
import type {CartActionData, CartWithActions} from '~/lib/types';

import {useRootLoaderData} from '../useRootLoaderData';

/**
 * Module-level promise chain that serializes all cart mutations.
 * This prevents concurrent API calls from returning stale cart state
 * that overwrites the results of earlier mutations (e.g. rapidly
 * removing multiple cart lines).
 */
let mutationQueue: Promise<CartActionData | null> = Promise.resolve(null);

export const useCart = (): CartWithActions => {
  const {isPreviewModeEnabled} = useRootLoaderData();
  const {publish, shop} = useAnalytics();

  const {
    state: {cart, status, error},
    actions: {setCart, setError, setStatus},
  } = useCartContext();

  const getCartActionData = useCallback(
    (formData: FormData): Promise<CartActionData | null> => {
      const action = formData.get('action');

      const mutation = async (): Promise<CartActionData | null> => {
        let data = null as CartActionData | null;
        setError(null);
        setStatus(action === CartForm.ACTIONS.Create ? 'creating' : 'updating');
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            body: formData,
          });
          data = await response.json();
          if (data?.userErrors?.length) {
            setError(data.userErrors);
          }
          if (data?.cart) {
            setCart(data.cart);
          }
          setStatus('idle');
          return data;
        } catch (err) {
          setError(err);
          setStatus('idle');
          return null;
        }
      };

      mutationQueue = mutationQueue.then(mutation, mutation);
      return mutationQueue;
    },
    [setCart, setError, setStatus],
  );

  const cartCreate: CartWithActions['cartCreate'] = useCallback(
    async (cartInput) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.Create);
      formData.append('cart', JSON.stringify(cartInput));
      return getCartActionData(formData);
    },
    [getCartActionData],
  );

  const linesAdd: CartWithActions['linesAdd'] = useCallback(
    async (lines) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesAdd);
      formData.append('lines', JSON.stringify(lines));
      return getCartActionData(formData);
    },
    [cart, getCartActionData, publish, shop],
  );

  const linesUpdate: CartWithActions['linesUpdate'] = useCallback(
    async (lines) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesUpdate);
      formData.append('lines', JSON.stringify(lines));
      return getCartActionData(formData);
    },
    [cart, getCartActionData, publish, shop],
  );

  const linesRemove: CartWithActions['linesRemove'] = useCallback(
    async (lineIds) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesRemove);
      formData.append('lineIds', JSON.stringify(lineIds));
      return getCartActionData(formData);
    },
    [cart, getCartActionData, publish, shop],
  );

  const discountCodesUpdate: CartWithActions['discountCodesUpdate'] =
    useCallback(
      async (discountCodes) => {
        const formData = new FormData();
        formData.append('action', CartForm.ACTIONS.DiscountCodesUpdate);
        formData.append('discountCodes', JSON.stringify(discountCodes));
        return getCartActionData(formData);
      },
      [getCartActionData],
    );

  const cartAttributesUpdate: CartWithActions['cartAttributesUpdate'] =
    useCallback(
      async (attributes) => {
        const formData = new FormData();
        formData.append('action', CartForm.ACTIONS.AttributesUpdateInput);
        formData.append('attributes', JSON.stringify(attributes));
        return getCartActionData(formData);
      },
      [getCartActionData],
    );

  const buyerIdentityUpdate: CartWithActions['buyerIdentityUpdate'] =
    useCallback(
      async (
        buyerIdentity: CartBuyerIdentityInput,
      ): Promise<CartActionData | null> => {
        const formData = new FormData();
        formData.append('action', CartForm.ACTIONS.BuyerIdentityUpdate);
        formData.append('buyerIdentity', JSON.stringify(buyerIdentity));
        return getCartActionData(formData);
      },
      [getCartActionData],
    );

  const noteUpdate: CartWithActions['noteUpdate'] = useCallback(
    async (note) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.NoteUpdate);
      formData.append('note', note);
      return getCartActionData(formData);
    },
    [getCartActionData],
  );

  return (
    isPreviewModeEnabled
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useClientSideCart()
      : {
          ...cart,
          lines: cart?.lines ? flattenConnection(cart.lines) : [],
          buyerIdentityUpdate,
          cartAttributesUpdate,
          cartCreate,
          discountCodesUpdate,
          error,
          linesAdd,
          linesRemove,
          linesUpdate,
          noteUpdate,
          status,
        }
  ) as CartWithActions;
};
