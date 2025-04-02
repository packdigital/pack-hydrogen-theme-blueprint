import type {
  Product,
  ProductOptionValue,
  ProductVariant,
  Video,
} from '@shopify/hydrogen/storefront-api-types';

import type {
  Group,
  SelectedProduct,
  SelectedVariant,
  SwatchesMap,
} from '~/lib/types';

export interface ProductItemProps {
  enabledColorNameOnHover?: boolean;
  enabledColorSelector?: boolean;
  enabledQuickShop?: boolean;
  enabledStarRating?: boolean;
  handle?: string;
  index: number;
  isShoppableProductItem?: boolean;
  onClick?: () => void;
  priority?: boolean;
  product?: Product | null;
  quickShopMobileHidden?: boolean;
  searchTerm?: string;
  swatchesMap?: SwatchesMap;
}

export interface ProductItemPriceProps {
  selectedVariant: SelectedVariant;
}

export interface QuickShopProps {
  enabledColorSelector?: boolean;
  quickShopMobileHidden?: boolean;
  selectedProduct: Product | null | undefined;
  selectedVariant: ProductVariant | null | undefined;
}

export interface QuickShopOptionsProps {
  quickShopMultiText: string;
  quickShopMobileHidden?: boolean;
  selectedProduct: Product;
  selectedVariant: ProductVariant;
}

export interface QuickShopOptionProps {
  optionName: string;
  selectedProduct: Product;
  optionValue: ProductOptionValue;
}

export interface ProductItemMediaProps {
  hasGrouping: boolean;
  selectedProduct: SelectedProduct;
  selectedVariant: SelectedVariant;
}

export interface ProductItemVideoProps {
  autoPlay?: boolean;
  media: Video;
}

export interface ColorVariantSelectorProps {
  enabledColorNameOnHover?: boolean;
  grouping?: Group | null;
  initialProduct: SelectedProduct;
  selectedVariant: SelectedVariant;
  setProductFromColorSelector: (product: SelectedProduct) => void;
  setVariantFromColorSelector: (variant: SelectedVariant | undefined) => void;
  swatchesMap?: SwatchesMap;
}

export interface ColorVariantOptionsProps {
  enabledColorNameOnHover?: boolean;
  grouping?: Group | null;
  initialProduct: SelectedProduct;
  initialProductColorOptions: ProductOptionValue[];
  selectedVariant: SelectedVariant;
  setProductFromColorSelector: (product: SelectedProduct) => void;
  setVariantFromColorSelector: (variant: SelectedVariant) => void;
  swatchesMap?: SwatchesMap;
}

export interface ColorVariantOptionProps {
  color: ProductOptionValue;
  enabledColorNameOnHover?: boolean;
  onClick: () => void;
  selectedVariantColor: string | undefined;
  swatchesMap?: SwatchesMap;
}
