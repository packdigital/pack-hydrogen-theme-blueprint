import {MediaCms} from '~/lib/types/pack.types';

export interface ProductSliderCms {
  heading: string;
  section: {
    fullWidth: boolean;
  };
  slides: ProductSliderSlide[];
}

export interface ProductSliderSlide {
  imageLocation: 'left' | 'right';
  imageDesktop: MediaCms;
  imageAltText: string;
  title: string;
  title2?: string;
  tagline?: string;
  description: string;
  featureOrientation?: 'horizontal' | 'vertical';
  features?: string[];
  buttons: Record<string, any>[];
}
