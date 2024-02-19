import {useMemo, useState} from 'react';
import equal from 'fast-deep-equal';

import {PRICE_FILTER_ID} from '~/lib/constants';
import {Svg} from '~/components';

import type {
  CollectionFilterDropdownProps,
  ParsedValue,
} from '../CollectionFilters.types';

import {CollectionFilterOption} from './CollectionFilterOption';

export function CollectionFilterDropdown({
  activeFilterValues,
  addFilter,
  defaultOpen,
  filter,
  optionsMaxCount,
  removeFilter,
  showCount,
  swatchesMap,
}: CollectionFilterDropdownProps) {
  const [maxOptions, setMaxOptions] = useState(
    optionsMaxCount || filter.values.length,
  );

  const parsedValues: ParsedValue[] = useMemo(() => {
    return filter.values.map((value) => {
      return {
        ...value,
        parsedInput: JSON.parse(value.input as string),
      };
    });
  }, [filter.values]);

  const parsedValuesWithIsActive: ParsedValue[] = useMemo(() => {
    return parsedValues.map((value) => {
      let newValue = value;
      if (value.id === PRICE_FILTER_ID) {
        const activePriceValue = activeFilterValues.find(
          (filter) => filter.id === PRICE_FILTER_ID,
        );
        const parsedDefaultInput = activePriceValue?.parsedDefaultInput || null;
        const isActive =
          !!parsedDefaultInput && !equal(value.parsedInput, parsedDefaultInput);
        newValue = {...newValue, isActive, parsedDefaultInput};
      } else {
        const isActive = activeFilterValues.some((filter) => {
          return equal(filter.parsedInput, value.parsedInput);
        });
        newValue = {...newValue, isActive};
      }
      return newValue;
    });
  }, [activeFilterValues, parsedValues]);

  const totalSelectedOptions: number = useMemo(() => {
    return parsedValuesWithIsActive.reduce((acc, value) => {
      if (value.isActive) acc++;
      return acc;
    }, 0);
  }, [parsedValuesWithIsActive]);

  const [isOpen, setIsOpen] = useState(defaultOpen || totalSelectedOptions > 0);

  return (
    <div className="border-b border-border">
      <button
        aria-label={filter.label}
        className={`relative flex min-h-[3rem] w-full items-center justify-between gap-4 px-4 py-2 text-left`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex flex-1 items-center">
          <h3 className="text-nav">{filter.label}</h3>

          {totalSelectedOptions > 0 && (
            <p className="ml-1 text-2xs text-mediumDarkGray">
              ({totalSelectedOptions})
            </p>
          )}
        </div>

        <Svg
          className={`w-4 text-text ${isOpen ? 'rotate-180' : ''}`}
          src="/svgs/chevron-down.svg#chevron-down"
          title="Chevron"
          viewBox="0 0 24 24"
        />
      </button>

      <div
        className={`flex-col md:items-start md:gap-2 md:pb-4 ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        <ul className="flex w-full flex-col md:items-start md:gap-2">
          {parsedValuesWithIsActive.slice(0, maxOptions).map((option) => {
            return (
              <li
                key={option.id}
                className="w-full max-md:border-b max-md:border-border max-md:last:border-none"
              >
                <CollectionFilterOption
                  addFilter={addFilter}
                  option={option}
                  removeFilter={removeFilter}
                  showCount={showCount}
                  swatchesMap={swatchesMap}
                />
              </li>
            );
          })}
        </ul>

        {maxOptions < filter.values.length && (
          <button
            type="button"
            className="h-6 px-4 text-left text-sm font-bold uppercase max-md:h-11 md:text-xs"
            aria-label="Show all options"
            onClick={() => setMaxOptions(filter.values.length)}
          >
            + {filter.values.length - maxOptions} More
          </button>
        )}
      </div>
    </div>
  );
}

CollectionFilterDropdown.displayName = 'CollectionFilterDropdown';
