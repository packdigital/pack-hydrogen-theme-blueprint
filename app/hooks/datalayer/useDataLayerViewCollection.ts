import {useEffect} from 'react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {useGlobal} from '~/hooks';

export function useDataLayerViewCollection({
  collection,
}: {
  collection: Collection | null;
}) {
  const {emitter} = useGlobal();

  useEffect(() => {
    if (!emitter?._events['VIEW_COLLECTION_PAGE']) return;
    if (!collection?.products?.nodes?.length) return;
    emitter?.emit(
      'VIEW_COLLECTION_PAGE',
      collection.products.nodes.slice(0, 12),
    );
  }, [emitter?._eventsCount, collection?.id]);
}
