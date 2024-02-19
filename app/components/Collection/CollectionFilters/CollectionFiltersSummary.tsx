import startCase from 'lodash/startCase';

import {Svg} from '~/components';

import {useCollectionFilters} from './useCollectionFilters';

export function CollectionFiltersSummary({className = '', hideClear = false}) {
  const {activeFilterValues, removeFilter, clearFilters} =
    useCollectionFilters();

  return activeFilterValues.length ? (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {activeFilterValues.map((filterValue, index) => {
        let id = filterValue.id;
        let filterLabel = filterValue.filter?.label;
        const [key, value] = Object.entries(filterValue.parsedInput)[0];
        let name;
        if (key === 'price') {
          const keyValue = value as {min: number; max: number};
          name = `$${keyValue.min} - $${keyValue.max}`;
          id = `${id}.${keyValue.min}-${keyValue.max}`;
        } else if (key === 'available') {
          if (value === true) name = 'In stock';
          if (value === false) name = 'Out of stock';
          filterLabel = 'Avail';
        } else if (
          typeof value === 'object' &&
          Object.hasOwn({...value}, 'value')
        ) {
          const keyValue = value as {value: string};
          name = keyValue.value;
        } else {
          name = value as string;
        }

        if (!name || typeof name !== 'string') return null;

        return (
          <li key={index} className="max-w-full">
            <button
              className="flex max-w-full items-center rounded-full bg-offWhite py-2 pl-2.5 pr-3 text-xs transition md:hover:bg-lightGray"
              onClick={() => {
                removeFilter(id);
              }}
              type="button"
            >
              <div className="flex-1 truncate">
                {filterLabel && (
                  <>
                    <span className="font-bold">{startCase(filterLabel)}:</span>{' '}
                  </>
                )}
                {name}
              </div>

              <Svg
                className="ml-1 w-2.5 text-text"
                src="/svgs/close.svg#close"
                title="Close"
                viewBox="0 0 24 24"
              />
            </button>
          </li>
        );
      })}

      {!hideClear && (
        <li className="pl-1">
          <button
            className="text-xs underline underline-offset-2"
            onClick={clearFilters}
            type="button"
          >
            Clear
          </button>
        </li>
      )}
    </ul>
  ) : null;
}

CollectionFiltersSummary.displayName = 'CollectionFiltersSummary';
