import {useMemo} from 'react';
import clsx from 'clsx';

import {COLOR_OPTION_NAME, PRICE_FILTER_ID} from '~/lib/constants';
import {isLightHexColor} from '~/lib/utils';
import {Image} from '~/components/Image';
import {Svg} from '~/components/Svg';

import type {CollectionFilterOptionProps} from '../CollectionFilters.types';

import {MultiRangeSlider} from './MultiRangeSlider';

export function CollectionFilterOption({
  addFilter,
  option,
  removeFilter,
  showCount,
  swatchesMap,
}: CollectionFilterOptionProps) {
  const {id, count, label, parsedInput, isActive, swatch} = option;

  const isPrice = id === PRICE_FILTER_ID;
  const isColor =
    parsedInput?.variantOption?.name === COLOR_OPTION_NAME.toLowerCase();
  let optionColor: string | undefined;
  let optionImage;
  let optionImageUrl: string | undefined;

  if (isColor) {
    const color = parsedInput.variantOption.value.toLowerCase();
    const swatchFromCms = swatchesMap?.[color];
    const colorFromCms = swatchFromCms?.color;
    const colorFromShopify = swatch?.color;
    optionColor = colorFromShopify || colorFromCms;
    const imageFromCms = swatchFromCms?.image;
    const imageFromShopify = color.swatch?.image?.previewImage;
    optionImage = imageFromShopify || imageFromCms;
    optionImageUrl = optionImage?.url;
  }

  const checkmarkColor = useMemo(() => {
    if (!isColor) return 'text-white';
    if (!optionColor) return 'text-black';
    return isLightHexColor(optionColor) ? 'text-black' : 'text-white';
  }, [isColor, optionColor]);

  const colorBackground = optionColor || 'var(--neutral-lightest)';
  const nonColorBackground = isActive
    ? 'var(--black)'
    : 'var(--neutral-lightest)';
  const disabled = !count;

  if (isPrice) {
    const currentMin = parsedInput.price.min;
    const currentMax = parsedInput.price.max;
    const defaultMin = option?.parsedDefaultInput?.price?.min ?? currentMin;
    const defaultMax = option?.parsedDefaultInput?.price?.max ?? currentMax;
    return (
      <div className="mx-auto w-full max-w-[400px] px-4 pb-4 md:pb-2">
        <MultiRangeSlider
          key={`${currentMin}-${currentMax}`}
          canReset={isActive}
          isPrice
          min={defaultMin}
          minValue={currentMin}
          max={defaultMax}
          maxValue={currentMax}
          onSubmit={({min, max}: {min: number; max: number}) => {
            const valueId = `${id}.${min}-${max}`;
            addFilter(valueId);
            if (min === defaultMin && max === defaultMax) {
              removeFilter(valueId);
            } else {
              addFilter(valueId);
            }
          }}
          onReset={() => {
            const currentValueId = `${id}.${currentMin}-${currentMax}`;
            removeFilter(currentValueId);
          }}
        />
      </div>
    );
  }

  return (
    <button
      aria-label={`Add ${label} to filters`}
      className={clsx(
        'group flex gap-3 px-4 text-left text-base transition max-md:h-10 max-md:w-full max-md:items-center md:gap-2 hover:md:text-text disabled:hover:md:text-neutralMedium',
        disabled && 'cursor-not-allowed opacity-60',
        isActive ? 'text-text max-md:font-bold' : 'text-neutralMedium',
      )}
      disabled={disabled}
      onClick={() => {
        if (isActive) {
          removeFilter(id);
        } else {
          addFilter(id);
        }
      }}
      type="button"
    >
      <div
        className={clsx(
          'relative flex size-5 items-center justify-center overflow-hidden border border-border transition md:mt-px md:size-[18px]',
          isColor ? 'rounded-[50%]' : 'rounded',
          !disabled && 'group-hover:md:border-text',
          isActive && 'border-text',
        )}
        style={{
          backgroundColor: isColor ? colorBackground : nonColorBackground,
        }}
      >
        {optionImageUrl && (
          <Image
            data={{
              altText: label,
              url: optionImageUrl,
              width: optionImage?.width,
              height: optionImage?.height,
            }}
            aspectRatio="1/1"
            width="24px"
            className="media-fill"
          />
        )}

        <div
          className={clsx(
            'media-fill rounded-[1px] border-white transition-[border-width] duration-100',
            isActive ? 'border-0 md:border-0' : 'border-0',
          )}
        />

        <Svg
          src="/svgs/checkmark.svg#checkmark"
          viewBox="0 0 24 24"
          className={clsx(
            'pointer-events-none w-6 transition md:w-5',
            checkmarkColor,
            isActive ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>

      <p className="flex-1 text-sm">
        {label}{' '}
        <span className={clsx('text-2xs', showCount ? 'inline' : 'hidden')}>
          ({count})
        </span>
      </p>
    </button>
  );
}

CollectionFilterOption.displayName = 'CollectionFilterOption';
