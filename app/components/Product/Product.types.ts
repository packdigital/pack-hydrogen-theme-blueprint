import type {Product} from '@shopify/hydrogen/storefront-api-types';

import type {SelectedVariant, Settings} from '~/lib/types';

export interface ProductProps {
  product: Product;
  initialSelectedVariant?: SelectedVariant;
}

export interface ProductDetailsProps {
  enabledQuantitySelector: boolean;
  product: Product;
  selectedVariant: SelectedVariant;
}

export interface ProductHeaderProps {
  isMobile?: boolean;
  product: Product;
  selectedVariant: SelectedVariant;
  selectedVariantColor: string | null | undefined;
  settings: Settings['product'];
}
