import type {ProductOptionValue} from '@shopify/hydrogen/storefront-api-types';

import type {
  ProductWithGrouping,
  SelectedVariant,
  Swatch,
  SwatchesMap,
} from '~/lib/types';

import type {OnSelect} from '../ProductOptions.types';

export interface ProductOptionValueProps {
  index: number;
  name: string;
  onSelect?: OnSelect;
  optimisticSelectedIndex: number;
  optionValue: ProductOptionValue;
  product: ProductWithGrouping;
  selectedOptionsMap?: Record<string, string> | null;
  setOptimisticSelectedIndex: (index: number) => void;
  setSelectedOption: (name: string, value: string) => void;
  swatchesMap: SwatchesMap;
}

export interface ProductOptionValueLinkProps {
  index: number;
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  onSelect?: OnSelect;
  optimisticSelectedIndex: number;
  optionName: string;
  optionValue: ProductOptionValue;
  selectedVariantFromOptions: SelectedVariant;
  setOptimisticSelectedIndex: (index: number) => void;
  swatch?: Swatch | null;
}

export interface ProductOptionValueButtonProps {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  onSelect?: OnSelect;
  optionName: string;
  optionValue: ProductOptionValue;
  selectedVariantFromOptions: SelectedVariant;
  setSelectedOption: (name: string, value: string) => void;
  swatch?: Swatch | null;
}

export interface InnerColorOptionValueProps {
  isAvailable: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  optionValue: ProductOptionValue;
  swatch?: Swatch | null;
}

export interface InnerOptionValueProps {
  isAvailable: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  optionValue: ProductOptionValue;
}
