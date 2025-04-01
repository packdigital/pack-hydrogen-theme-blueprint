import type {ProductCms} from '~/lib/types';

export interface ShoppableProductsGridCms {
  heading: string;
  headingTextAlign: string;
  products: {
    product: ProductCms;
  }[];
  grid: {
    columnsDesktop: string;
    columnsTablet: string;
    columnsMobile: string;
  };
  productItem: {
    enabledStarRating: boolean;
  };
}
