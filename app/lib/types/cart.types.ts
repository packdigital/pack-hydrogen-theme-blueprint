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
  /**
   * Optimistically set a cart line's quantity. The visible quantity updates
   * immediately; the real cart mutation is debounced and batched. Pass a
   * quantity of 0 to optimistically remove the line.
   */
  setLineQuantity: (lineId: string, quantity: number) => void;
  /**
   * Optimistically apply a relative change (+1 / -1) to a cart line. Prefer this
   * over `setLineQuantity` for +/- buttons: it bases the next value on the
   * freshest pending change, so rapid clicks accumulate without waiting for a
   * re-render. `currentQuantity` is the fallback base when nothing is pending.
   */
  adjustLineQuantity: (
    lineId: string,
    delta: number,
    currentQuantity: number,
  ) => void;
  /**
   * Immediately flush any pending debounced line-quantity changes and resolve
   * once the resulting mutation(s) have settled. Call before checkout / unload.
   */
  flushPendingCartUpdates: () => Promise<void>;
  status: CartStatus;
  error: CartError;
};

/**
 * A cart line augmented with the last server-known quantity while an optimistic
 * quantity is being applied. Money on the line stays computed against
 * `_serverQuantity` so per-line/cart totals don't move until the mutation
 * reconciles (money is never optimistic).
 */
export type OptimisticCartLine = CartLine & {_serverQuantity?: number};
