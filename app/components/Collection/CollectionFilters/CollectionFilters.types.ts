import type {
  Filter,
  FilterValue,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

type AddFilter = (id: string) => void;
type ClearFilters = () => void;
type RemoveFilter = (id: string) => void;
type SwatchesMap = Record<string, string>;

export type ActiveFilterValue = FilterValue & {
  filter: {
    id: Filter['id'];
    label: Filter['label'];
    type: Filter['type'];
  };
  parsedInput: ProductFilter;
  parsedDefaultInput?: ProductFilter;
};

export type ParsedValue = FilterValue & {
  isActive?: boolean;
  parsedInput: ProductFilter;
  parsedDefaultInput?: ProductFilter | null;
};

export interface CollectionDesktopFiltersProps {
  desktopFiltersOpen: boolean;
  swatchesMap: SwatchesMap | undefined;
}

export interface CollectionFilterDropdownProps {
  activeFilterValues: ActiveFilterValue[];
  addFilter: AddFilter;
  defaultOpen?: boolean;
  filter: Filter;
  optionsMaxCount?: number;
  removeFilter: RemoveFilter;
  showCount?: boolean;
  swatchesMap?: SwatchesMap | undefined;
}

export interface CollectionFilterOptionProps {
  addFilter: AddFilter;
  option: Record<string, any>;
  removeFilter: RemoveFilter;
  showCount?: boolean;
  swatchesMap: SwatchesMap | undefined;
}

export interface CollectionMobileFiltersProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  swatchesMap?: SwatchesMap | undefined;
}

export interface ContextProviderValue {
  state: {
    activeFilterValues: ActiveFilterValue[];
    filters: Filter[];
  };
  actions: {
    addFilter: AddFilter;
    clearFilters: ClearFilters;
    removeFilter: RemoveFilter;
  };
}
