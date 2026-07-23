import type {
  Image,
  MediaEdge,
  MediaImage,
} from '@shopify/hydrogen/storefront-api-types';

import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

export interface ProductMediaProps {
  product: ProductWithGrouping;
  selectedVariant: SelectedVariant;
  selectedVariantColor: string | null | undefined;
}

export interface ProductImageProps {
  alt?: string;
  image?: Image;
  onLoad?: () => void;
  priority?: boolean;
}

export interface ProductMediaFileProps {
  alt: string;
  media: MediaEdge['node'];
  onLoad?: () => void;
  priority?: boolean;
}

export interface ProductMediaThumbnailProps {
  alt: string;
  image: MediaImage['previewImage'];
  index: number;
  isActive: boolean;
  mediaContentType: string;
  onThumbClick: (index: number) => void;
}

export interface ProductMediaThumbnailsProps {
  activeIndex: number | null;
  media: MediaEdge['node'][];
  onThumbClick: (index: number) => void;
  productTitle: string;
}

export interface ProductVideoProps {
  inView: boolean;
  media: MediaEdge['node'];
  onLoad?: () => void;
  priority?: boolean;
}
