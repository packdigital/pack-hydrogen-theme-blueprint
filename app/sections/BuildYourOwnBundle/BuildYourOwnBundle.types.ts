import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

import type {ContainerSettings} from '~/settings/container';
import type {ProductCms} from '~/lib/types';

interface ProductGrouping {
  name: string;
  products: {
    product: ProductCms;
  }[];
  subnavName: string;
}

interface Tier {
  heading: string;
  message: string;
  percent: number;
  type: 'none' | 'percent' | 'buyXGetYFree';
}

type ProductVariantWithIndexes = ProductVariant & {indexes: number[]};

export type BundleMapById = Record<string, ProductVariantWithIndexes>;

export interface BuildYourOwnBundleCms {
  container: ContainerSettings;
  defaultHeading: string;
  preselects: {
    product: ProductCms;
  }[];
  productGroupings: ProductGrouping[];
  tiers: Tier[];
}

export interface BYOBSummaryProps {
  bundle: ProductVariant[];
  defaultHeading: string;
  handleRemoveFromBundle: (index: number) => void;
  tiers: Tier[];
}

export interface BYOBSubnavProps {
  activeTabIndex: number;
  className?: string;
  productGroupings: ProductGrouping[];
  setActiveTabIndex: (index: number) => void;
}

export interface BYOBAddToCartProps {
  addToCartUnlocked: boolean;
  bundle: ProductVariant[];
  total: string;
}
