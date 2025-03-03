import type {Product} from '@shopify/hydrogen/storefront-api-types';

import type {SelectedVariant, Settings} from '~/lib/types';

export interface ProductProps {
  initialSelectedVariant?: SelectedVariant;
  isModalProduct?: boolean;
  isSectionProduct?: boolean;
  product: Product;
}

export interface ProductDetailsProps {
  enabledQuantitySelector: boolean;
  isModalProduct?: boolean;
  product: Product;
  selectedVariant: SelectedVariant;
}

export interface ProductHeaderProps {
  isMobile?: boolean;
  isModalProduct?: boolean;
  product: Product;
  selectedVariant: SelectedVariant;
  selectedVariantColor: string | null | undefined;
  settings: Settings['product'];
}
