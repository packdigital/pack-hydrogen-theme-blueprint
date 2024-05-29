import type {
  MediaEdge,
  Product,
  ProductVariant,
  Video,
} from '@shopify/hydrogen-react/storefront-api-types';

import type {BundleMapById} from '../BuildYourOwnBundle.types';

type Bundle = ProductVariant[];
type HandleRemoveFromBundle = (index: number) => void;
type HandleAddToBundle = (variant: ProductVariant) => void;

export interface BYOBProductItemProps {
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handle: string;
  incrementDisabled: boolean;
  index: number;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
}

export interface BYOBProductItemMediaProps {
  media?: MediaEdge['node'][];
  productTitle?: string;
}

export interface BYOBProductItemVideoProps {
  autoPlay?: boolean;
  media: Video;
}

export interface BYOBQuickShopProps {
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
  incrementDisabled: boolean;
  product: Product | null | undefined;
  selectedVariant: ProductVariant | null | undefined;
}

export interface BYOBQuickShopOptionsProps {
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
  incrementDisabled: boolean;
  product: Product | null | undefined;
}

export interface BYOBQuickShopOptionProps {
  activeQtySelectorIndex: number | null;
  bundle: Bundle;
  bundleMapById: BundleMapById;
  handleAddToBundle: HandleAddToBundle;
  handleRemoveFromBundle: HandleRemoveFromBundle;
  incrementDisabled: boolean;
  index: number;
  optionName: string;
  product: Product | null | undefined;
  setActiveQtySelectorIndex: (index: number | null) => void;
  value: string;
}
