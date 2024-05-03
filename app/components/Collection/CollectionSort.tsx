import {useCallback, useMemo} from 'react';
import {useSearchParams} from '@remix-run/react';
import type {
  ProductCollectionSortKeys,
  SearchSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

import {Select, Svg} from '~/components';

import type {CollectionSortProps} from './Collection.types';

const COLLECTION_SORT_KEYS = [
  {
    key: 'default',
    label: 'Featured',
    value: JSON.stringify({sortKey: 'COLLECTION_DEFAULT', reverse: false}),
  },
  {
    key: 'bestSelling',
    label: 'Best Selling',
    value: JSON.stringify({sortKey: 'BEST_SELLING', reverse: false}),
  },
  {
    key: 'lowToHigh',
    label: 'Low to High',
    value: JSON.stringify({sortKey: 'PRICE', reverse: false}),
  },
  {
    key: 'highToLow',
    label: 'High to Low',
    value: JSON.stringify({sortKey: 'PRICE', reverse: true}),
  },
  {
    key: 'aToZ',
    label: 'A to Z',
    value: JSON.stringify({sortKey: 'TITLE', reverse: false}),
  },
  {
    key: 'zToA',
    label: 'Z to A',
    value: JSON.stringify({sortKey: 'TITLE', reverse: true}),
  },
  {
    key: 'newest',
    label: 'Newest',
    value: JSON.stringify({sortKey: 'CREATED', reverse: true}),
  },
  {
    key: 'oldest',
    label: 'Oldest',
    value: JSON.stringify({sortKey: 'CREATED', reverse: false}),
  },
];

const SEARCH_SORT_KEYS = [
  {
    key: 'relevance',
    label: 'Relevance',
    value: JSON.stringify({sortKey: 'RELEVANCE', reverse: false}),
  },
  {
    key: 'lowToHigh',
    label: 'Low to High',
    value: JSON.stringify({sortKey: 'PRICE', reverse: false}),
  },
  {
    key: 'highToLow',
    label: 'High to Low',
    value: JSON.stringify({sortKey: 'PRICE', reverse: true}),
  },
];

interface Option {
  label: string;
  value: string;
}

export function CollectionSort({
  isSearchResults,
  settings,
}: CollectionSortProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const options = useMemo(() => {
    const KEYS = isSearchResults ? SEARCH_SORT_KEYS : COLLECTION_SORT_KEYS;
    return KEYS.map((option) => {
      const labelOverride = settings?.sort?.[`${option.key}Label`];
      return {
        ...option,
        label: labelOverride || option.label,
      };
    });
  }, [isSearchResults, settings?.sort]);

  const selectedSort = useMemo(() => {
    let sortKey;
    if (isSearchResults) {
      sortKey = String(
        searchParams.get('sortKey')?.toUpperCase(),
      ) as SearchSortKeys;
    } else {
      sortKey = String(
        searchParams.get('sortKey')?.toUpperCase(),
      ) as ProductCollectionSortKeys;
    }
    const reverse = Boolean(searchParams.get('reverse') ?? false);
    if (!sortKey) return {label: '', value: ''};
    const value = JSON.stringify({sortKey, reverse});
    const {key = '', label = ''} = {
      ...options.find((option) => option.value === value),
    };
    return {key, label, value};
  }, [isSearchResults, options, searchParams]);

  const handleSort = useCallback(
    (option: Option) => {
      if (!option?.value) return;
      const {sortKey, reverse} = JSON.parse(option.value);
      searchParams.set('sortKey', sortKey.toLowerCase());
      if (reverse) {
        searchParams.set('reverse', '1');
      } else {
        searchParams.delete('reverse');
      }
      setSearchParams(searchParams, {
        preventScrollReset: false,
      });
    },
    [searchParams],
  );

  return (
    <div className="ml-auto w-full md:w-auto md:min-w-32">
      <Select
        className="[&>button]:max-md:h-14 [&>button]:max-md:rounded-none [&>button]:max-md:border-x-0 [&>button]:max-md:pl-4 [&>button]:max-md:pr-2.5 [&>ul]:max-md:w-[calc(100%-32px)]"
        onSelect={handleSort}
        options={options}
        placeholder="Sort"
        selectedOption={selectedSort}
        placeholderClass="text-text"
      >
        <Svg
          className="inline w-4 text-current"
          src="/svgs/sort.svg#sort"
          title="Filter"
          viewBox="0 0 24 24"
        />

        {/* desktop */}
        <div className="flex flex-1 overflow-hidden text-sm max-md:hidden">
          <span className="truncate ">{selectedSort?.label || 'Sort'}</span>
        </div>

        {/* mobile */}
        <div className="flex flex-1 items-center overflow-hidden md:hidden">
          <span className="text-nav">Sort</span>
          <span className="truncate pl-2 text-xs text-mediumDarkGray xs:pl-3 xs:text-sm">
            {selectedSort.label}
          </span>
        </div>
      </Select>
    </div>
  );
}

CollectionSort.displayName = 'CollectionSort';
