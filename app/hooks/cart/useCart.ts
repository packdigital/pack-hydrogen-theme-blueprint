import {useCallback} from 'react';
import {CartForm, flattenConnection} from '@shopify/hydrogen';
import {useCart as useClientSideCart} from '@shopify/hydrogen-react';
import type {
  Cart,
  CartBuyerIdentityInput,
} from '@shopify/hydrogen/storefront-api-types';

import {useCartContext} from '~/contexts/CartProvider/useCartContext';
import type {CartActionData, CartWithActions} from '~/lib/types';

import {useRootLoaderData} from '../useRootLoaderData';

export const useCart = (): CartWithActions => {
  const {isPreviewModeEnabled} = useRootLoaderData();

  const {
    state: {cart, status, error},
    actions: {setCart, setError, setStatus},
  } = useCartContext();

  const getCartActionData = useCallback(
    async (formData: FormData): Promise<CartActionData | null> => {
      const action = formData.get('action');
      let data = null as CartActionData | null;
      setError(null);
      setStatus(action === CartForm.ACTIONS.Create ? 'creating' : 'updating');
      const response = await fetch('/api/cart', {
        method: 'POST',
        body: formData,
      });
      data = await response.json();
      if (data?.userErrors?.length) {
        setError(data?.userErrors);
      }
      if (data?.cart) {
        setStatus('fetching');
        const response = await fetch('/api/cart');
        const newCartData = (await response.json()) as {cart: Cart | null};
        if (newCartData.cart) setCart(newCartData.cart);
        data = {...data, cart: newCartData.cart};
      }
      setStatus('idle');
      return data;
    },
    [],
  );

  const cartCreate: CartWithActions['cartCreate'] = useCallback(
    async (cartInput) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.Create);
      formData.append('cart', JSON.stringify(cartInput));
      return getCartActionData(formData);
    },
    [],
  );

  const linesAdd: CartWithActions['linesAdd'] = useCallback(
    async (lines) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesAdd);
      formData.append('lines', JSON.stringify(lines));
      return getCartActionData(formData);
    },
    [cart],
  );

  const linesUpdate: CartWithActions['linesUpdate'] = useCallback(
    async (lines) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesUpdate);
      formData.append('lines', JSON.stringify(lines));
      return getCartActionData(formData);
    },
    [],
  );

  const linesRemove: CartWithActions['linesRemove'] = useCallback(
    async (lineIds) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesRemove);
      formData.append('lineIds', JSON.stringify(lineIds));
      return getCartActionData(formData);
    },
    [],
  );

  const discountCodesUpdate: CartWithActions['discountCodesUpdate'] =
    useCallback(async (discountCodes) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.DiscountCodesUpdate);
      formData.append('discountCodes', JSON.stringify(discountCodes));
      return getCartActionData(formData);
    }, []);

  const cartAttributesUpdate: CartWithActions['cartAttributesUpdate'] =
    useCallback(async (attributes) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.AttributesUpdateInput);
      formData.append('attributes', JSON.stringify(attributes));
      return getCartActionData(formData);
    }, []);

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
      [],
    );

  const noteUpdate: CartWithActions['noteUpdate'] = useCallback(
    async (note) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.NoteUpdate);
      formData.append('note', note);
      return getCartActionData(formData);
    },
    [],
  );

  return (
    isPreviewModeEnabled
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useClientSideCart()
      : {
          ...cart,
          ...(cart?.lines ? {lines: flattenConnection(cart.lines)} : null),
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
