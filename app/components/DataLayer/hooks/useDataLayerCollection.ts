import {useCallback, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen-react/storefront-api-types';

import {pathWithoutLocalePrefix} from '~/lib/utils';
import {useGlobal} from '~/hooks';

import {mapProductItemProduct, mapProductItemVariant} from './utils';
import type {UserProperties} from './useDataLayerInit';

type DlProductVariant = ProductVariant & {index: number; list?: string};

export function useDataLayerCollection({
  DEBUG,
  userDataEvent,
  userDataEventTriggered,
  userProperties,
}: {
  DEBUG?: boolean;
  userDataEvent: (arg0: any) => void;
  userDataEventTriggered: boolean;
  userProperties: UserProperties;
}) {
  const collectionHandleRef = useRef<string | undefined>(undefined);
  const {emitter} = useGlobal();

  const [collectionProducts, setCollectionProducts] = useState<
    Product[] | null
  >(null);
  const [clickedCollectionItem, setClickedCollectionItem] =
    useState<DlProductVariant | null>(null);

  const viewCollectionEvent = useCallback(
    ({
      products,
      userProperties: _userProperties,
    }: {
      products?: Product[];
      userProperties: UserProperties;
    }) => {
      if (!products?.length) return;
      const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
      const list = windowPathname.startsWith('/collections')
        ? windowPathname
        : '';
      const event = {
        event: 'view_item_list',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: products[0].variants?.nodes?.[0]?.price?.currencyCode,
          impressions: products.slice(0, 12).map(mapProductItemProduct(list)),
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [],
  );

  const clickCollectionItemEvent = useCallback(
    ({variant}: {variant?: DlProductVariant}) => {
      if (!variant) return;
      const list = variant.list || '';
      const event = {
        event: 'select_item',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: userProperties,
        ecommerce: {
          currencyCode: variant.price?.currencyCode,
          click: {
            actionField: {
              list,
              action: 'click',
            },
            products: [variant].map(mapProductItemVariant(list)),
          },
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [userProperties],
  );

  // Subscribe to EventEmitter topic for 'dl_view_item_list' and 'dl_select_item' events
  useEffect(() => {
    emitter?.on('VIEW_COLLECTION_PAGE', (products: Product[]) => {
      setCollectionProducts(products);
    });
    emitter?.on('CLICK_COLLECTION_ITEM', (variant: DlProductVariant) => {
      setClickedCollectionItem(variant);
    });
    return () => {
      emitter?.off('VIEW_COLLECTION_PAGE', (products: Product[]) => {
        setCollectionProducts(products);
      });
      emitter?.off('CLICK_COLLECTION_ITEM', (variant: DlProductVariant) => {
        setClickedCollectionItem(variant);
      });
    };
  }, []);

  // Trigger 'user_data' and view 'view_item_list'
  // events on collection page and after base data is ready
  useEffect(() => {
    const pageHandle = pathWithoutLocalePrefix(window.location.pathname)
      .split('/')
      .pop();
    if (
      !collectionProducts?.length ||
      !userProperties ||
      collectionHandleRef.current === pageHandle
    )
      return;
    userDataEvent({userProperties});
    viewCollectionEvent({products: collectionProducts, userProperties});
    collectionHandleRef.current = pageHandle;
  }, [collectionProducts, !!userProperties]);

  // Trigger 'select_item' event on clicked collection
  // item and after user event
  useEffect(() => {
    if (!clickedCollectionItem || !userDataEventTriggered) return;
    clickCollectionItemEvent({variant: clickedCollectionItem});
  }, [clickedCollectionItem, userDataEventTriggered]);
}
