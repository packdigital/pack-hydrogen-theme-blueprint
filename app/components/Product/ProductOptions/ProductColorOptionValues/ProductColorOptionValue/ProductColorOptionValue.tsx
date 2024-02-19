import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import type {ProductWithGrouping, Settings, SiteSettings} from '~/lib/types';

import {ColorOptionButton} from './ColorOptionButton';
import {ColorOptionLink} from './ColorOptionLink';

export type Swatch = Settings['product']['colors']['swatches'][number];

interface ProductColorOptionValueProps {
  groupingProductsMapByColor: Record<string, Product> | null;
  isSelected: boolean;
  name: string;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string> | null;
  setSelectedOption: (name: string, value: string) => void;
  value: string;
}

export function ProductColorOptionValue({
  groupingProductsMapByColor,
  isSelected,
  name,
  product,
  selectedOptionsMap,
  setSelectedOption,
  value,
}: ProductColorOptionValueProps) {
  const siteSettings = useSiteSettings() as SiteSettings;
  const swatches = siteSettings?.settings?.product?.colors?.swatches;
  const isFromGrouping = product.isGrouped;

  const newSelectedOptions = useMemo(() => {
    return selectedOptionsMap
      ? {
          ...selectedOptionsMap,
          [name]: value,
        }
      : null;
  }, [name, selectedOptionsMap, value]);

  const swatch = useMemo((): Swatch | null => {
    if (!swatches) return null;
    return (
      swatches.find(
        ({name: swatchName}) =>
          swatchName?.trim().toLowerCase() === value.toLowerCase(),
      ) || null
    );
  }, [swatches, value]);

  return isFromGrouping ? (
    <ColorOptionLink
      groupingProductsMapByColor={groupingProductsMapByColor}
      isSelected={isSelected}
      newSelectedOptions={newSelectedOptions}
      swatch={swatch}
      value={value}
    />
  ) : (
    <ColorOptionButton
      isSelected={isSelected}
      name={name}
      product={product}
      setSelectedOption={setSelectedOption}
      swatch={swatch}
      value={value}
    />
  );
}

ProductColorOptionValue.displayName = 'ProductColorOptionValue';
