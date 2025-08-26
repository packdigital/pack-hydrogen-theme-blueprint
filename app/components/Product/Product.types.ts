import type {Product} from '@shopify/hydrogen/storefront-api-types';

import type {SelectedVariant, Settings} from '~/lib/types';

export interface ProductProps {
  initialSelectedVariant?: SelectedVariant;
  isModalProduct?: boolean;
  isSectionProduct?: boolean;
  product: Product;
}

export interface ProductDetailsProps {
  enabledQuantitySelector?: boolean;
  isModalProduct?: boolean;
  product: Product;
  quantity: number;
  selectedVariant: SelectedVariant;
  setQuantity: (quantity: number) => void;
}

export interface ProductAddToCartProps {
  enabledQuantitySelector?: boolean;
  quantity: number;
  selectedVariant: SelectedVariant;
  setQuantity: (quantity: number) => void;
}

export interface ProductStickyAddToCartProps {
  enabledQuantitySelector?: boolean;
  quantity: number;
  selectedVariant: SelectedVariant;
  setQuantity: (quantity: number) => void;
  viewports?: string;
}

export interface ProductHeaderProps {
  isMobile?: boolean;
  isModalProduct?: boolean;
  product: Product;
  selectedVariant: SelectedVariant;
  selectedVariantColor: string | null | undefined;
  settings: Settings['product'];
}
