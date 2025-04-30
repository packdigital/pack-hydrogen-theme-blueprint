import {Collection} from '@shopify/hydrogen/storefront-api-types';

import type {LinkCms} from '~/lib/types';

export interface CategorySliderCms {
  heading: string;
  categorys: {
    collection: Collection;
  }[];
  section: {
    fullWidth: boolean;
    margin: number;
  };
}
