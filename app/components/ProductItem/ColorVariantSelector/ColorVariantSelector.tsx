import {useEffect, useMemo} from 'react';

import {COLOR_OPTION_NAME} from '~/lib/constants';

import type {ColorVariantSelectorProps} from '../ProductItem.types';

import {ColorVariantOptions} from './ColorVariantOptions';

export function ColorVariantSelector({
  enabledColorNameOnHover,
  grouping,
  initialProduct,
  selectedVariant,
  setProductFromColorSelector,
  setVariantFromColorSelector,
  swatchesMap,
}: ColorVariantSelectorProps) {
  const initialProductColorOptions = useMemo(() => {
    return (
      initialProduct?.options?.find(
        (option) => option.name === COLOR_OPTION_NAME,
      )?.optionValues || []
    );
  }, [initialProduct]);

  // determine if there are multiple colors to select from
  const hasMultipleColorsFromProduct =
    !grouping && initialProductColorOptions?.length > 1;
  const hasMultipleColorsFromGrouping =
    !!grouping?.isReady &&
    (grouping?.optionsMap?.[COLOR_OPTION_NAME] || []).length > 1;
  const hasMultipleColors =
    hasMultipleColorsFromProduct || hasMultipleColorsFromGrouping;

  // sets initial variant from initial color
  useEffect(() => {
    if (!initialProduct || !hasMultipleColors) return;
    setProductFromColorSelector(initialProduct);
    setVariantFromColorSelector(initialProduct.variants?.nodes?.[0]);
  }, [initialProduct?.id, hasMultipleColors]);

  return hasMultipleColors && selectedVariant ? (
    <div className="mt-3.5">
      <ColorVariantOptions
        enabledColorNameOnHover={enabledColorNameOnHover}
        grouping={grouping}
        initialProduct={initialProduct}
        initialProductColorOptions={initialProductColorOptions}
        selectedVariant={selectedVariant}
        setProductFromColorSelector={setProductFromColorSelector}
        setVariantFromColorSelector={setVariantFromColorSelector}
        swatchesMap={swatchesMap}
      />
    </div>
  ) : null;
}

ColorVariantSelector.displayName = 'ColorVariantSelector';
