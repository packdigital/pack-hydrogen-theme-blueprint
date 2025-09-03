import {useMemo} from 'react';
import type {Metafield, Product} from '@shopify/hydrogen/storefront-api-types';

import {ProductMetafieldsAccordion} from './ProductMetafieldsAccordion';

const EXAMPLE_METAFIELDS_MAP: Record<string, Metafield> = {
  'custom.sizing': {
    namespace: 'custom',
    id: 'gid://shopify/Metafield/1234567890',
    key: 'sizing',
    value:
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br/><br/><em>Example details. Data sourced from product metafields. See code for customization.</em></p>',
  } as Metafield,
  'custom.care': {
    namespace: 'custom',
    id: 'gid://shopify/Metafield/0987654321',
    key: 'care',
    value: `<ul><li>Lorem ipsum dolor sit amet</li><li>Consectetur adipiscing elit</li><li>Sed do eiusmod tempor</li></ul><p><em>Example details. Data sourced from product metafields. See code for customization.</em></p>`,
  } as Metafield,
};

const METAFIELDS_ORDER = ['custom.sizing', 'custom.care'];

interface ProductMetafieldsProps {
  product: Product;
}

export function ProductMetafields({product}: ProductMetafieldsProps) {
  const metafields = useMemo(() => {
    // if (!product.metafields) return null;
    // const metafieldsMap = product.metafields;
    const metafieldsMap = EXAMPLE_METAFIELDS_MAP; // example purposes
    return METAFIELDS_ORDER.reduce((acc: Metafield[], key) => {
      const metafield = metafieldsMap[key];
      if (!metafield) return acc;
      return [...acc, metafield];
    }, []);
  }, [product.metafields]);

  return metafields?.length ? (
    <ul className="grid grid-cols-1 gap-4">
      {metafields.map((metafield) => {
        return (
          <li key={metafield.id}>
            <ProductMetafieldsAccordion metafield={metafield} />
          </li>
        );
      })}
    </ul>
  ) : null;
}

ProductMetafields.displayName = 'ProductMetafields';
