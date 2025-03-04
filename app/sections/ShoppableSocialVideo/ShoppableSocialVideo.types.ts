import type {Product} from '@shopify/hydrogen/storefront-api-types';

import type {MediaCms, ProductCms, SwatchesMap} from '~/lib/types';

interface ProductSettings {
  enabledStarRating: boolean;
  enabledQuantitySelector: boolean;
  optionsBtnText: string;
  optionsBtnStyle: string;
  atcBtnText: string;
  atcBtnStyle: string;
  notifyMeText: string;
  viewText: string;
  badgeBgColor: string;
  badgeTextColor: string;
}

interface SliderSettings {
  enabledScrollbar: boolean;
  scrollbarColor: string;
  slideBgColor: string;
  slideBgOpacity: number;
  slideBgBlur: number;
  slideTextColor: string;
}

export interface ShoppableSocialVideoCms {
  video: {
    video: MediaCms;
    poster: MediaCms;
  };
  products: {
    product: ProductCms;
    image: MediaCms;
    badge: string;
    description: string;
  }[];
  product: ProductSettings;
  slider: SliderSettings;
  text: {
    heading: string;
    subtext: string;
    enabledScrollForMore: boolean;
    scrollText: string;
    color: string;
  };
  background: {
    colorType: string;
    firstColor: string;
    secondColor: string;
    thirdColor: string;
  };
}

export interface ShoppableSocialVideoProductCardProps {
  product: Product;
  image: MediaCms;
  isActive: boolean;
  badge: string;
  description: string;
  productSettings: ProductSettings;
  sliderSettings: SliderSettings;
  swatchesMap?: SwatchesMap;
}
