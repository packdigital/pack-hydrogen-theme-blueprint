import {useState} from 'react';

import {QuantitySelector} from '~/components/QuantitySelector';
import {Svg} from '~/components/Svg';

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

  const variantToAdd = !selectedVariant
    ? undefined
    : {
        ...selectedVariant,
        image: selectedVariant.image || product?.featuredImage,
      };

  const quantityInBundle = bundle.filter(
    (variant) => variant.product.handle === product?.handle,
  ).length;

  const variantInBundle = bundleMapById[selectedVariant?.id || ''];

  const lastBundleIndexOfVariant =
    variantInBundle?.indexes[variantInBundle?.indexes.length - 1] || -1;

  const hasOnlySingleValueOptions =
    product?.options?.every((option) => option.optionValues.length === 1) ||
    false;
  const hasOnlyOneOptionWithMultipleValues =
    product?.options?.reduce(
      (acc, option) => acc + (option.optionValues.length > 1 ? 1 : 0),
      0,
    ) === 1 || false;
  const qualifiesForQuickShop =
    !!product &&
    (hasOnlySingleValueOptions || hasOnlyOneOptionWithMultipleValues);

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
