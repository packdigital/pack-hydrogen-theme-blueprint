import type {
  Product,
  ProductOptionValue,
} from '@shopify/hydrogen/storefront-api-types';

import type {
  OptionWithGroups,
  ProductWithGrouping,
  SelectedVariant,
  SwatchesMap,
} from '~/lib/types';

export interface ProductOptionsProps {
  isModalProduct?: boolean;
  isShoppableProductCard?: boolean;
  product: Product;
  selectedOptionsMap?: Record<string, string> | null;
  setSelectedOption: (option: string, value: string) => void;
  swatchesMap?: SwatchesMap;
}

export type OnSelect = ({
  selectedVariant,
  optionName,
  optionValue,
  fromGrouping,
}: {
  selectedVariant: SelectedVariant;
  optionName: string;
  optionValue: Pick<ProductOptionValue, 'name'>;
  fromGrouping?: boolean;
}) => void;

export interface ProductOptionValuesProps {
  isModalProduct?: boolean;
  onSelect?: OnSelect;
  option: OptionWithGroups;
  product: ProductWithGrouping;
  selectedOptionsMap?: Record<string, string> | null;
  setSelectedOption: (name: string, value: string) => void;
  swatchesMap?: SwatchesMap;
}

export interface ProductOptionValuesLabelProps {
  name: string;
  selectedValue?: string | null;
}
