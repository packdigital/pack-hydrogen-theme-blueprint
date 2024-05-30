import type {ChangeEvent} from 'react';
import {useCallback, useEffect, useMemo, useState, useRef} from 'react';

import {parseAsCurrency} from '~/lib/utils';
import {useLocale} from '~/hooks';

interface MultiRangeSliderProps {
  min: number;
  minValue?: number;
  max: number;
  maxValue?: number;
  canReset?: boolean;
  isPrice?: boolean;
  onChange?: ({min, max}: {min: number; max: number}) => void;
  onReset?: () => void;
  onSubmit?: ({min, max}: {min: number; max: number}) => void;
  withSubmit?: boolean;
}

export const MultiRangeSlider = ({
  min,
  minValue,
  max,
  maxValue,
  isPrice,
  canReset = false,
  onChange,
  onReset,
  onSubmit,
  withSubmit = true,
}: MultiRangeSliderProps) => {
  const [minVal, setMinVal] = useState(minValue ?? min);
  const [maxVal, setMaxVal] = useState(maxValue ?? max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const currencySymbol = useMemo(() => {
    if (!isPrice) return '';
    return locale.label?.split(' ').pop()?.split(')')[0].trim() || '';
  }, [isPrice, locale.label]);

  const displayedMinVal = useMemo(() => {
    if (!isPrice) return minVal;
    return parseAsCurrency(minVal, locale);
  }, [isPrice, locale, minVal]);

  const displayedMaxVal = useMemo(() => {
    if (!isPrice) return maxVal;
    return parseAsCurrency(maxVal, locale);
  }, [isPrice, locale, maxVal]);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    if (typeof onChange !== 'function') return;
    onChange({min: minVal, max: maxVal});
  }, [minVal, maxVal, onChange]);

  const hasChanges = minVal !== minValue || maxVal !== maxValue;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-10 w-full items-center justify-center pb-4">
        <input
          id="multirange-slider-min"
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(+e.target.value, maxVal - 1);
            setMinVal(value);
            e.target.value = value.toString();
          }}
          className={`range-thumb z-[3] w-full ${
            minVal > max - 100 ? 'z-[5]' : ''
          }`}
        />
        <label htmlFor="multirange-slider-min" className="sr-only">
          Min
        </label>
        <input
          id="multirange-slider-max"
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(+e.target.value, minVal + 1);
            setMaxVal(value);
            e.target.value = value.toString();
          }}
          className="range-thumb z-[4] w-full"
        />
        <label htmlFor="multirange-slider-max" className="sr-only">
          Max
        </label>

        <div className="relative w-full">
          <div className="absolute z-[1] h-1 w-full rounded-[3px] bg-lightGray"></div>
          <div
            ref={range}
            className="absolute z-[2] h-1 rounded-[3px] bg-black"
          ></div>
          <div className="absolute left-0 mt-5 flex w-full justify-between text-sm text-text">
            <p>{displayedMinVal}</p>
            <p>{displayedMaxVal}</p>
          </div>
        </div>
      </div>

      {withSubmit && (
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={`Set min and max values to ${minVal} and ${maxVal}`}
            className={`mt-3 rounded border border-border px-1 py-px text-xs font-bold uppercase transition ${
              hasChanges ? '' : 'opacity-40'
            }`}
            disabled={!hasChanges}
            onClick={() => {
              if (typeof onSubmit !== 'function') return;
              onSubmit({min: minVal, max: maxVal});
            }}
          >
            Set
          </button>

          <button
            type="button"
            aria-label={`Set min and max values to ${minVal} and ${maxVal}`}
            className={`mt-3 rounded border border-border px-1 py-px text-xs font-bold uppercase ${
              canReset ? '' : 'opacity-40'
            }`}
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
