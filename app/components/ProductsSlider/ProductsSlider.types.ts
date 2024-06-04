import type {LinkCms, ProductCms} from '~/lib/types';

export interface ProductsSliderCms {
  button: LinkCms;
  heading: string;
  productItem: {
    enabledColorNameOnHover: boolean;
    enabledColorSelector: boolean;
    enabledQuickShop: boolean;
    enabledStarRating: boolean;
    quickShopMobileHidden: boolean;
  };
  limit?: number;
  products: {
    product: ProductCms;
  }[];
  section: {
    buttonStyle: string;
    fullWidth: boolean;
    maxWidth: string;
  };
  slider: {
    slidesPerViewDesktop: number;
    slidesPerViewMobile: number;
    slidesPerViewTablet: number;
    sliderStyle: string;
  };
}
