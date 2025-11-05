import {useCallback} from 'react';
import {CartForm, flattenConnection, useAnalytics} from '@shopify/hydrogen';
import {useCart as useClientSideCart} from '@shopify/hydrogen-react';
import equal from 'fast-deep-equal';
import type {
  Cart,
  CartBuyerIdentityInput,
  CartLine,
  CartLineInput,
} from '@shopify/hydrogen/storefront-api-types';

import {useCartContext} from '~/contexts/CartProvider/useCartContext';
import {AnalyticsEvent} from '~/components/Analytics/constants';
import type {CartActionData, CartWithActions} from '~/lib/types';

import {useRootLoaderData} from '../useRootLoaderData';

export const useCart = (): CartWithActions => {
  const {isPreviewModeEnabled} = useRootLoaderData();
  const {publish, shop} = useAnalytics();

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
      const data = await getCartActionData(formData);
      if (data?.cart) {
        lines.forEach((lineInput) => {
          const prevLine =
            flattenConnection(cart?.lines).find((prevCartLine) => {
              return compareInputWithLine(lineInput, prevCartLine as CartLine);
            }) || null;
          const currentLine =
            flattenConnection(data.cart?.lines).find((currentCartLine) => {
              return compareInputWithLine(
                lineInput,
                currentCartLine as CartLine,
              );
            }) || null;
          publish(AnalyticsEvent.PRODUCT_ADD_TO_CART, {
            cart: data.cart,
            prevCart: cart,
            currentLine,
            prevLine,
            shop,
          });
        });
      }
      return data;
    },
    [cart, publish, shop],
  );

  const linesUpdate: CartWithActions['linesUpdate'] = useCallback(
    async (lines) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesUpdate);
      formData.append('lines', JSON.stringify(lines));
      const data = await getCartActionData(formData);
      if (data?.cart) {
        lines.forEach((lineInput) => {
          const prevLine =
            flattenConnection(cart?.lines).find((prevCartLine) => {
              return prevCartLine.id === lineInput.id;
            }) || null;
          const currentLine =
            flattenConnection(data.cart?.lines).find((currentCartLine) => {
              return currentCartLine.id === lineInput.id;
            }) || null;
          if ((currentLine?.quantity || 0) > (prevLine?.quantity || 0)) {
            publish(AnalyticsEvent.PRODUCT_ADD_TO_CART, {
              cart: data.cart,
              prevCart: cart,
              currentLine,
              prevLine,
              shop,
            });
          } else if ((currentLine?.quantity || 0) < (prevLine?.quantity || 0)) {
            publish(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, {
              cart: data.cart,
              prevCart: cart,
              currentLine,
              prevLine,
              shop,
            });
          }
        });
      }
      return data;
    },
    [cart, publish, shop],
  );

  const linesRemove: CartWithActions['linesRemove'] = useCallback(
    async (lineIds) => {
      const formData = new FormData();
      formData.append('action', CartForm.ACTIONS.LinesRemove);
      formData.append('lineIds', JSON.stringify(lineIds));
      const data = await getCartActionData(formData);
      if (data?.cart) {
        lineIds.forEach((lineId) => {
          const prevLine =
            flattenConnection(cart?.lines).find((prevCartLine) => {
              return prevCartLine.id === lineId;
            }) || null;
          const currentLine =
            flattenConnection(data.cart?.lines).find((currentCartLine) => {
              return currentCartLine.id === lineId;
            }) || null;
          publish(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, {
            cart: data.cart,
            prevCart: cart,
            currentLine,
            prevLine,
            shop,
          });
        });
      }
      return data;
    },
    [cart, publish, shop],
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

const compareInputWithLine = (input: CartLineInput, line: CartLine) => {
  const inputAttrLength = input.attributes ? input.attributes.length : 0;
  const lineAttrLength = line.attributes ? line.attributes.length : 0;
  if (inputAttrLength !== lineAttrLength) return false;
  if (inputAttrLength || lineAttrLength) {
    const inputAttributesByKey = input.attributes?.reduce(
      (acc: Record<string, string>, attr) => {
        acc[attr.key] = attr.value;
        return acc;
      },
      {},
    );
    const lineAttributesByKey = line.attributes?.reduce(
      (acc: Record<string, string>, attr) => {
        acc[attr.key] = attr.value;
        return acc;
      },
      {},
    );
    if (!equal(inputAttributesByKey, lineAttributesByKey)) return false;
  }
  if (input.sellingPlanId !== line.sellingPlanAllocation?.sellingPlan?.id)
    return false;
  return line.merchandise.id === input.merchandiseId;
};
