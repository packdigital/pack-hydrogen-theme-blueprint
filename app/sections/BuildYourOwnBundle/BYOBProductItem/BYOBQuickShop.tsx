import {useMemo, useState} from 'react';

import {QuantitySelector, Svg} from '~/components';

import {BYOBQuickShopOptions} from './BYOBQuickShopOptions';
import type {BYOBQuickShopProps} from './BYOBProductItem.types';

export function BYOBQuickShop({
  bundle,
  bundleMapById,
  handleAddToBundle,
  handleRemoveFromBundle,
  incrementDisabled,
  product,
  selectedVariant,
}: BYOBQuickShopProps) {
  const [optionsVisible, setOptionsVisible] = useState(false);

  const variantToAdd = useMemo(() => {
    if (!selectedVariant) return undefined;
    return {
      ...selectedVariant,
      image: selectedVariant.image || product?.featuredImage,
    };
  }, [selectedVariant?.id]);

  const quantityInBundle = useMemo(() => {
    return bundle.filter(
      (variant) => variant.product.handle === product?.handle,
    ).length;
  }, [bundle, product]);

  const variantInBundle = bundleMapById[selectedVariant?.id || ''];

  const lastBundleIndexOfVariant =
    variantInBundle?.indexes[variantInBundle?.indexes.length - 1] || -1;

  const qualifiesForQuickShop = useMemo(() => {
    if (!product) return false;

    const initialOptions = product.options;
    const options = initialOptions;

    const hasOnlySingleValueOptions =
      options?.every((option) => {
        return option.values.length === 1;
      }) || false;
    const hasOnlyOneOptionWithMultipleValues =
      options?.reduce((acc, option) => {
        return acc + (option.values.length > 1 ? 1 : 0);
      }, 0) === 1 || false;

    return hasOnlySingleValueOptions || hasOnlyOneOptionWithMultipleValues;
  }, [product?.id]);

  const hasOneVariant = product?.variants?.nodes?.length === 1;

  return qualifiesForQuickShop ? (
    <div className="flex size-full justify-center">
      {!quantityInBundle && hasOneVariant && (
        <button
          aria-label={`Add one ${product?.title} to your bundle`}
          className="btn-primary !size-12 !p-0"
          disabled={!variantToAdd || incrementDisabled}
          onClick={() => {
            if (variantToAdd) handleAddToBundle(variantToAdd);
          }}
          type="button"
        >
          <Svg
            className="w-4 text-current"
            src="/svgs/plus.svg#plus"
            title="Plus"
            viewBox="0 0 24 24"
          />
        </button>
      )}

      {!quantityInBundle && product && !hasOneVariant && !optionsVisible && (
        <button
          aria-label={`Add one ${product?.title} to your bundle`}
          className="btn-primary !size-12 !p-0"
          disabled={!variantToAdd || incrementDisabled}
          onClick={() => setOptionsVisible(true)}
          type="button"
        >
          <Svg
            className="w-4 text-current"
            src="/svgs/plus.svg#plus"
            title="Plus"
            viewBox="0 0 24 24"
          />
        </button>
      )}

      {optionsVisible && (
        <BYOBQuickShopOptions
          bundle={bundle}
          bundleMapById={bundleMapById}
          handleRemoveFromBundle={handleRemoveFromBundle}
          handleAddToBundle={handleAddToBundle}
          incrementDisabled={incrementDisabled}
          product={product}
        />
      )}

      {quantityInBundle > 0 && !optionsVisible && (
        <div className="flex size-full items-center justify-center">
          <QuantitySelector
            disableIncrement={incrementDisabled}
            productTitle={product?.title}
            quantity={quantityInBundle}
            handleDecrement={() =>
              handleRemoveFromBundle(lastBundleIndexOfVariant)
            }
            handleIncrement={() => {
              if (variantToAdd) handleAddToBundle(variantToAdd);
            }}
          />
        </div>
      )}
    </div>
  ) : null;
}

BYOBQuickShop.displayName = 'BYOBQuickShop';
