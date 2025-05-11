import {Product} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';

import {JigglePetsBundlerUpsell} from './CollectionCards/JigglePets/JigglePetsBundlerUpsell';
import {COLLECTION_NAME_HANDLES} from './collectionNames.constants';

export function ProductMarketing({product}: {product: Product}) {
  const isJigglePets = useMemo(
    () =>
      !!product.collections.nodes.find(
        ({handle}) => handle === COLLECTION_NAME_HANDLES.JIGGLE_PETS,
      ),
    [product.collections.nodes],
  );

  return (
    <div className="my-8">
      {isJigglePets && (
        <JigglePetsBundlerUpsell size="medium" cardType="popular" />
      )}
    </div>
  );
}
