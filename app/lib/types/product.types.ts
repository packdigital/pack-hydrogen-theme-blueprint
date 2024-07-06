import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import type {ImageCms} from '~/lib/types';

export type SelectedProduct = Product | null | undefined;

export type SelectedVariant = ProductVariant | null | undefined;

export interface OptionWithGroups {
  name: string;
  values: string[];
  groups?: {name: string; values: string[]}[];
  hasSubgroups?: boolean;
}

export interface Subgroup {
  id: string;
  title: string;
  description: string;
  products: {handle: string}[];
}

export interface Group {
  id: string;
  title: string;
  description: string;
  products: {handle: string}[];
  subgroups: Subgroup[];
  options?: OptionWithGroups[];
  optionsMap?: Record<string, string[]>;
  allProducts?: {handle: string}[];
  productsByHandle?: Record<string, Product>;
  productsByOptionValue?: Record<string, Record<string, Product[]>>;
  isReady?: boolean;
}

export interface ProductWithGrouping extends Product {
  grouping?: Group;
}

export type ProductGroupings = Group[];
export type GroupingIndexesMap = Record<string, number> | null;

export interface GroupingsState {
  groupings: ProductGroupings;
  groupingIndexesMap: GroupingIndexesMap;
}

export interface GroupingActions {
  setGroupings: (groupings: ProductGroupings) => void;
  setGroupingIndexesMap: (groupingIndexesMap: GroupingIndexesMap) => void;
}

export interface GroupingsContext {
  state: GroupingsState;
  actions: GroupingActions;
}
