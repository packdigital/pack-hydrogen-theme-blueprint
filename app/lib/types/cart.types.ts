import type {
  Cart,
  CartBuyerIdentityInput,
  CartInput,
  CartLine,
  CartLineInput,
  CartLineUpdateInput,
  AttributeInput,
  UserError,
  CartWarning,
} from '@shopify/hydrogen/storefront-api-types';

import type {CartError, CartStatus} from './context.types';

export interface CartActionData {
  cart: Cart | null;
  userErrors: UserError[] | null;
  warnings: CartWarning[] | null;
}

export type CartWithActions = Omit<Cart, 'lines'> & {
  lines: CartLine[];
  cartCreate: (cartInput: CartInput) => Promise<CartActionData | null>;
  linesAdd: (lines: CartLineInput[]) => Promise<CartActionData | null>;
  linesUpdate: (lines: CartLineUpdateInput[]) => Promise<CartActionData | null>;
  linesRemove: (lineIds: string[]) => Promise<CartActionData | null>;
  discountCodesUpdate: (
    discountCodes: string[],
  ) => Promise<CartActionData | null>;
  cartAttributesUpdate: (
    attributes: AttributeInput[],
  ) => Promise<CartActionData | null>;
  buyerIdentityUpdate: (
    buyerIdentity: CartBuyerIdentityInput,
  ) => Promise<CartActionData | null>;
  noteUpdate: (note: string) => Promise<CartActionData | null>;
  status: CartStatus;
  error: CartError;
};
