import type {
  Collection,
  ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';

import type {Settings, SwatchesMap} from '~/lib/types';

import type {ActiveFilterValue} from './CollectionFilters/CollectionFilters.types';

type PromoTile =
  Settings['collection']['promotion']['campaigns'][number]['promoTiles'][number];

export interface CollectionProps {
  activeFilterValues: ActiveFilterValue[];
  collection: Collection;
  searchTerm?: string;
  showHeading?: boolean;
  title?: string;
}

export interface CollectionGridProps {
  desktopFiltersOpen: boolean;
  isSearchResults?: boolean;
  products: ProductConnection;
  promoTiles?: PromoTile[] | null;
  searchTerm?: string;
  settings: Settings['collection'];
  swatchesMap?: SwatchesMap;
}

export interface CollectionMenuDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
}

export interface CollectionPromoTileProps {
  tile: PromoTile;
}

export interface CollectionSortProps {
  isSearchResults?: boolean;
  settings: Settings['collection'];
}
