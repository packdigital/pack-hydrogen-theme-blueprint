import type {
  MediaEdge,
  Product,
  ProductOptionValue,
  ProductVariant,
  Video,
} from '@shopify/hydrogen-react/storefront-api-types';

import type {BundleMapById} from '../BuildYourOwnPack.types';

type Bundle = ProductVariant[];
type HandleRemoveFromBundle = (id: string) => void;
type HandleAddToBundle = (variant: ProductVariant) => void;

export interface BYOPProductItemProps {
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handle: string;
  incrementDisabled: boolean;
  index: number;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
}

export interface BYOPProductItemMediaProps {
  media?: MediaEdge['node'][];
  productTitle?: string;
}

export interface BYOPProductItemVideoProps {
  autoPlay?: boolean;
  media: Video;
}

export interface BYOPQuickShopProps {
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
  incrementDisabled: boolean;
  product: Product | null | undefined;
  selectedVariant: ProductVariant | null | undefined;
}

export interface BYOPQuickShopOptionsProps {
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
  incrementDisabled: boolean;
  product: Product | null | undefined;
}

export interface BYOPQuickShopOptionProps {
  activeQtySelectorIndex: number | null;
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
  incrementDisabled: boolean;
  index: number;
  optionName: string;
  optionValue: ProductOptionValue;
  product: Product | null | undefined;
  setActiveQtySelectorIndex: (index: number | null) => void;
}
