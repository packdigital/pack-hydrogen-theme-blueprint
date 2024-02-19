import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import type {Settings} from '~/lib/types';

type CloseCart = () => void;

export interface CartProps {
  settings: Settings['cart'];
}

export interface CartEmptyProps {
  closeCart?: CloseCart;
  settings: Settings['cart'];
}

export interface CartHeaderProps {
  closeCart?: CloseCart;
  heading?: string;
}

export interface CartLineProps {
  closeCart?: CloseCart;
  line: CartLine;
}

export interface CartTotalsProps {
  settings: Settings['cart'];
}

export interface CartUpsellProps {
  closeCart?: CloseCart;
  settings: Settings['cart'];
}

export interface CartUpsellItemProps {
  closeCart?: CloseCart;
  handle: string;
  isOnlyUpsell?: boolean;
}

export interface FreeShippingMeterProps {
  settings: Settings['cart'];
}
