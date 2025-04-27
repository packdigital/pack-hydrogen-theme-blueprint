import type {LinkCms, ProductCms} from '~/lib/types';

export interface FeaturedSliderCms {
  heading: string;
  design: 'expanded' | 'normal';
  limit?: number;
  products: {
    product: ProductCms;
  }[];
  link: LinkCms;
  section: {
    fullWidth: boolean;
    margin: number;
  };
}
