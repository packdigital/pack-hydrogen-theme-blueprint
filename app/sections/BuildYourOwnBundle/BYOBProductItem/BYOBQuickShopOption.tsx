import {useMemo} from 'react';

import {Svg} from '~/components';

import type {BYOBQuickShopOptionProps} from './BYOBProductItem.types';

export function BYOBQuickShopOption({
  activeQtySelectorIndex,
  bundle,
  bundleMapById,
  handleAddToBundle,
  handleRemoveFromBundle,
  incrementDisabled,
  index,
  optionName,
  product,
  setActiveQtySelectorIndex,
  value,
}: BYOBQuickShopOptionProps) {
  const variantToAdd = useMemo(() => {
    const variant = product?.variants?.nodes?.find((variant) => {
      const variantOption = variant.selectedOptions?.find(
        (option) => option.name === optionName,
      )?.value;
      return variantOption === value;
    });
    if (!variant) return undefined;
    return {
      ...variant,
      image: variant.image || product?.featuredImage,
    };
  }, [optionName, product, value]);

  const showQtySelector = activeQtySelectorIndex === index;
  const variantInBundle = bundleMapById[variantToAdd?.id || ''];
  const lastBundleIndexOfVariant = variantInBundle?.indexes
    ? variantInBundle.indexes[variantInBundle.indexes.length - 1] ?? -1
    : -1;

  const disabled = !variantToAdd;
  const isSoldOut = !disabled && !variantToAdd.availableForSale;
  const validClass =
    disabled || isSoldOut
      ? 'cursor-not-allowed'
      : 'md:hover:bg-black md:hover:text-white';
  const unavailableClass = isSoldOut
    ? 'after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-mediumGray text-gray overflow-hidden'
    : '';
  const selectedClass = showQtySelector
    ? 'bg-black text-white md:hover:bg-black md:hover:text-white'
    : variantInBundle
    ? 'bg-darkGray text-white'
    : 'bg-background';

  return (
    <div
      className="group/option relative size-full"
      onMouseEnter={() => {
        if (variantInBundle) setActiveQtySelectorIndex(index);
      }}
      onMouseLeave={() => {
        if (variantInBundle) setActiveQtySelectorIndex(null);
      }}
    >
      <button
        aria-label={value}
        className={`relative flex size-full items-center justify-center overflow-hidden whitespace-nowrap px-1 text-center text-sm transition disabled:cursor-not-allowed disabled:md:hover:bg-background disabled:md:hover:text-text ${selectedClass} ${validClass} ${unavailableClass}`}
        disabled={
          disabled || isSoldOut || (incrementDisabled && !variantInBundle)
        }
        onClick={() => {
          if (!variantInBundle && variantToAdd) {
            handleAddToBundle(variantToAdd);
            setActiveQtySelectorIndex(null);
          } else if (showQtySelector) {
            setActiveQtySelectorIndex(null);
          } else {
            setActiveQtySelectorIndex(index);
          }
        }}
        type="button"
      >
        {value}
      </button>

      {showQtySelector && (
        <>
          <button
            aria-label={`Remove ${variantToAdd?.title} from bundle by 1`}
            className={`absolute left-0 top-0 flex h-1/2 w-full items-center justify-center border-b border-text bg-background text-text disabled:cursor-not-allowed disabled:text-gray md:hover:bg-black md:hover:text-white disabled:md:hover:bg-background disabled:md:hover:text-gray`}
            disabled={bundle?.length === 0}
            onClick={() => {
              if (variantInBundle) {
                handleRemoveFromBundle(lastBundleIndexOfVariant);
                setActiveQtySelectorIndex(null);
              }
            }}
            type="button"
          >
            <Svg
              className="w-4 text-current"
              src="/svgs/minus.svg#minus"
              title="Minus"
              viewBox="0 0 24 24"
            />
          </button>

          <button
            aria-label={`Add ${variantToAdd?.title} to bundle by 1`}
            className="absolute bottom-0 left-0 flex h-1/2 w-full items-center justify-center bg-background text-text disabled:cursor-not-allowed disabled:text-gray md:hover:bg-black md:hover:text-white disabled:md:hover:bg-background disabled:md:hover:text-gray"
            disabled={incrementDisabled}
            onClick={() => {
              if (variantToAdd) {
                handleAddToBundle(variantToAdd);
                setActiveQtySelectorIndex(null);
              }
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
        </>
      )}
    </div>
  );
}

BYOBQuickShopOption.displayName = 'BYOBQuickShopOption';
