import {useMemo, useState} from 'react';
import equal from 'fast-deep-equal';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';

import {PRICE_FILTER_ID} from '~/lib/constants';
import {Svg} from '~/components';
import {useSettings} from '~/hooks';

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
  removeFilter,
  swatchesMap,
}: CollectionFilterDropdownProps) {
  const {collection: collectionSettings} = useSettings();
  const {
    optionsMaxCount = 6,
    showCount = true,
    showMoreCount = 10,
  } = {
    ...collectionSettings?.filters,
  };

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

  const showMoreCountMax = Math.min(
    showMoreCount,
    filter.values.length - maxOptions,
  );
  const showLessCountMax = Math.min(
    showMoreCount,
    maxOptions - optionsMaxCount,
  );
  const showMoreButton = maxOptions < filter.values.length;
  const showLessButton = maxOptions > optionsMaxCount;

  return (
    <Disclosure
      as="div"
      className="border-b border-border"
      defaultOpen={defaultOpen || totalSelectedOptions > 0}
    >
      {({open}) => (
        <>
          <DisclosureButton
            aria-label={filter.label}
            className={`relative flex min-h-12 w-full items-center justify-between gap-4 px-4 py-2 text-left`}
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
              className={`w-4 text-text ${open ? 'rotate-180' : ''}`}
              src="/svgs/chevron-down.svg#chevron-down"
              title="Chevron"
              viewBox="0 0 24 24"
            />
          </DisclosureButton>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-97 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-97 opacity-0"
          >
            <DisclosurePanel className="flex-col md:items-start md:gap-2 md:pb-4">
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

              {(showMoreButton || showLessButton) && (
                <div className="md:mt-2">
                  {showLessButton && (
                    <button
                      type="button"
                      className="h-6 px-4 text-left text-sm font-bold uppercase max-md:h-11 md:text-xs"
                      aria-label={`Show ${showLessCountMax} less options`}
                      onClick={() =>
                        setMaxOptions(maxOptions - showLessCountMax)
                      }
                    >
                      Show {showLessCountMax} Less
                    </button>
                  )}

                  {showMoreButton && (
                    <button
                      type="button"
                      className="h-6 px-4 text-left text-sm font-bold uppercase max-md:h-11 md:text-xs"
                      aria-label={`Show ${showMoreCountMax} more options`}
                      onClick={() =>
                        setMaxOptions(maxOptions + showMoreCountMax)
                      }
                    >
                      Show {showMoreCountMax} More
                    </button>
                  )}
                </div>
              )}
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

CollectionFilterDropdown.displayName = 'CollectionFilterDropdown';
