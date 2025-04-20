import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

export type MappedSelectedBundle = {
  size: number;
  title: string;
  savings: string;
};

export const tierMapToVariants: Record<
  number,
  Partial<MappedSelectedBundle & ProductVariant>
> = {
  6: {
    title: 'Small',
    size: 6,
    savings: '1.50',
  },
  14: {title: 'Medium', size: 14, savings: '4.50'},
  30: {title: 'Large', size: 30, savings: '8.50'},
};
