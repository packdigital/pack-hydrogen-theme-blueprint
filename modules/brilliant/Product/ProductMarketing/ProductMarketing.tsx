import {Product} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';

import {JigglePetsBundlerUpsell} from './CollectionCards/JigglePets/JigglePetsBundlerUpsell';
import {FlipDeckUpsell} from './FlipDeckUpsell';
import {
  PRODUCT_NAME_HANDLES,
  COLLECTION_NAME_HANDLES,
} from './markettingHandles.constants';

export function ProductMarketing({product}: {product: Product}) {
  const isJigglePets = useMemo(
    () =>
      !!product.collections.nodes.find(
        ({handle}) => handle === COLLECTION_NAME_HANDLES.JIGGLE_PETS,
      ),
    [product.collections.nodes],
  );

  const isFlipDeck = useMemo(
    () => product.handle === PRODUCT_NAME_HANDLES.FLIPDECK,
    [product.handle],
  );

  return (
    <div className="my-8">
      {isJigglePets && (
        <JigglePetsBundlerUpsell size="medium" cardType="popular" />
      )}

      {isFlipDeck && <FlipDeckUpsell />}
    </div>
  );
}
