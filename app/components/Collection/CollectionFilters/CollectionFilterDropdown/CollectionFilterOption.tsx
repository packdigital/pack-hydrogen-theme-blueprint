import {useMemo} from 'react';

import {COLOR_OPTION_NAME, PRICE_FILTER_ID} from '~/lib/constants';
import {isLightHexColor} from '~/lib/utils';
import {Image, Svg} from '~/components';
import type {Swatch} from '~/lib/types';

import type {CollectionFilterOptionProps} from '../CollectionFilters.types';

import {MultiRangeSlider} from './MultiRangeSlider';

export function CollectionFilterOption({
  addFilter,
  option,
  removeFilter,
  showCount,
  swatchesMap,
}: CollectionFilterOptionProps) {
  const {id, count, label, parsedInput, isActive} = option;

  const isPrice = id === PRICE_FILTER_ID;
  const isColor =
    parsedInput?.variantOption?.name === COLOR_OPTION_NAME.toLowerCase();
  let swatch: Swatch | undefined;
  let image: string | undefined;

  if (isColor) {
    const color = parsedInput.variantOption.value.toLowerCase();
    swatch = swatchesMap?.[color];
    image = swatch?.image?.src;
  }

  const checkmarkColor = useMemo(() => {
    if (!isColor) return 'text-white';
    if (!swatch) return 'text-black';
    return isLightHexColor(swatch.color) ? 'text-black' : 'text-white';
  }, [isColor, swatch]);

  const colorBackground = swatch?.color || 'var(--off-white)';
  const nonColorBackground = isActive ? 'var(--black)' : 'var(--off-white)';
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
      className={`group flex gap-3 px-4 text-left text-base transition max-md:h-10 max-md:w-full max-md:items-center md:gap-2 hover:md:text-text disabled:hover:md:text-mediumDarkGray ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      } ${isActive ? 'text-text max-md:font-bold' : 'text-mediumDarkGray'}`}
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
        className={`relative flex size-5 items-center justify-center overflow-hidden border border-border transition md:mt-px md:size-[18px] ${
          isColor ? 'rounded-[50%]' : 'rounded'
        } ${!disabled ? 'group-hover:md:border-text' : ''} ${
          isActive ? 'border-text' : ''
        }`}
        style={{
          backgroundColor: isColor ? colorBackground : nonColorBackground,
        }}
      >
        {image && (
          <Image
            data={{
              altText: label,
              url: image,
            }}
            aspectRatio="1/1"
            width="24"
            isStatic
            className="media-fill"
          />
        )}

        <div
          className={`media-fill rounded-[1px] border-white transition-[border-width] duration-100 ${
            isActive ? 'border-0 md:border-0' : 'border-0'
          }`}
        />

        <Svg
          src="/svgs/checkmark.svg#checkmark"
          viewBox="0 0 24 24"
          className={`pointer-events-none w-6 transition md:w-5 ${checkmarkColor} ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      <p className="flex-1 text-sm">
        {label}{' '}
        <span className={`text-2xs ${showCount ? 'inline' : 'hidden'}`}>
          ({count})
        </span>
      </p>
    </button>
  );
}

CollectionFilterOption.displayName = 'CollectionFilterOption';
