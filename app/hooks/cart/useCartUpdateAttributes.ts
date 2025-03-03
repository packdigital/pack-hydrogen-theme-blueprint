import {useCallback} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import type {
  AttributeInput,
  Cart,
} from '@shopify/hydrogen/storefront-api-types';

/* Hook that updates shopify cart attributes using the Storefront API query
   This hook ensures adding existing attributes added by 3rd party scripts

   Note: A common mistake of updating cart attributes with Shopify's
   cartAttributesUpdate mutation is that existing attributes need to be included
   when adding new attributes. Sometimes 3rd party scripts don't include this.
*/

export function useCartUpdateAttributes() {
  const {cartAttributesUpdate, id} = useCart();

  const updateCartAttributes = useCallback(
    async (attributes: {key: string; value: string}[]) => {
      const response = await fetch(`/api/cart-attributes?id=${id}`, {
        method: 'GET',
      });

      const {cart}: {cart: Cart} = await response.json();

      const existingAttributes = cart?.attributes || [];

      cartAttributesUpdate([
        ...existingAttributes,
        ...attributes,
      ] as AttributeInput[]);
    },
    [id],
  );

  return {updateCartAttributes};
}
