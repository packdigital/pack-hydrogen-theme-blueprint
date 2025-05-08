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
  6: {
    title: 'Starter',
    size: 6,
    savings: '3.00',
    savingsText: 'vs. buying individually',
    tagline: 'Perfect for first-time collectors!',
  },
  14: {
    title: 'Popular Pick',
    size: 14,
    savings: '15.00',
    savingsText: 'when bundled',
    tagline: 'Great value for animal lovers!',
  },
  30: {
    title: 'Collectors Edition',
    size: 30,
    savings: '45.00',
    savingsText: 'on the largest set',
    tagline: 'Best deal for super fans & gift-givers!',
  },
};
