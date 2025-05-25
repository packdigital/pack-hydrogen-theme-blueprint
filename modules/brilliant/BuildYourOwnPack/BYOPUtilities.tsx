import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

export type MappedSelectedBundle = {
  size: number;
  title: string;
  savings: string;
  savingsText: string;
  tagline: string;
};

export const tierMapToVariants: Record<
  number,
  Partial<MappedSelectedBundle & ProductVariant>
> = {
  3: {
    title: 'Starter Pack',
    size: 3,
    savings: '20%',
    savingsText: 'vs. buying individually',
    tagline: 'Just enough to fall in love!',
  },
  7: {
    title: 'Fan Favorite',
    size: 7,
    savings: '30%',
    savingsText: 'with this bundle',
    tagline: 'A great value for animal lovers!',
  },
  12: {
    title: 'Collector’s Set',
    size: 12,
    savings: '40%',
    savingsText: 'on the group',
    tagline: 'Best deal for collectors & gift-givers!',
  },
};
