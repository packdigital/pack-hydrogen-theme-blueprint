import type {
  Product,
  ProductOptionValue,
  ProductVariant,
  Metafield,
} from '@shopify/hydrogen/storefront-api-types';

export type SelectedProduct = Product | null | undefined;

export type SelectedVariant = ProductVariant | null | undefined;

export type ProductWithStatus = Product & {
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
};

export type ParsedMetafields = Record<string, Metafield | null>;

export type MetafieldIdentifier = {namespace?: string; key: string};

export interface OptionWithGroups {
  name: string;
  optionValues: ProductOptionValue[];
  groups?: {name: string; optionValues: ProductOptionValue[]}[];
  hasSubgroups?: boolean;
}

export interface Subgroup {
  id: string;
  title: string;
  description: string;
  products: {handle: string; id: string}[];
}

export interface InitialGroup {
  id: string;
  title: string;
  description: string;
  products: {handle: string; id: string}[];
  subgroups: Subgroup[];
  allProducts: Product[];
}

export interface Group {
  id: string;
  title: string;
  description: string;
  products: {handle: string; id: string}[];
  subgroups: Subgroup[];
  options?: OptionWithGroups[];
  optionsMap?: Record<string, ProductOptionValue[]>;
  allProducts?: {handle: string; id: string}[];
  productsByHandle?: Record<string, Product>;
  productsByOptionValue?: Record<string, Record<string, Product[]>>;
  isReady?: boolean;
}

export interface ProductWithInitialGrouping extends Product {
  selectedVariant?: SelectedVariant;
  initialGrouping?: InitialGroup;
}

export interface ProductWithGrouping extends Product {
  selectedVariant?: SelectedVariant;
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
