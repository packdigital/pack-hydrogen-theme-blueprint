import {useCallback, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

import {pathWithoutLocalePrefix} from '~/lib/utils';
import {useGlobal} from '~/hooks';

import {mapProductPageVariant} from './utils';
import type {UserProperties} from './useDataLayerInit';

export function useDataLayerProduct({
  DEBUG,
  userDataEvent,
  userProperties,
}: {
  DEBUG?: boolean;
  userDataEvent: (arg0: any) => void;
  userProperties: UserProperties;
}) {
  const productHandleRef = useRef<string | null>(null);
  const {emitter} = useGlobal();

  const [viewedProductVariant, setViewedProductVariant] =
    useState<ProductVariant | null>(null);

  const viewProductEvent = useCallback(
    ({
      variant,
      userProperties: _userProperties,
    }: {
      variant?: ProductVariant;
      userProperties: UserProperties;
    }) => {
      if (!variant) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const list = previousPath?.startsWith('/collections') ? previousPath : '';
      const event = {
        event: 'view_item',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: variant.price?.currencyCode,
          detail: {
            actionField: {list, action: 'detail'},
            products: [variant].map(mapProductPageVariant(list)),
          },
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
    },
    [],
  );

  // Subscribe to EventEmitter topic for 'view_item' event
  useEffect(() => {
    emitter?.on('VIEW_PRODUCT_PAGE', (variant: ProductVariant) => {
      setViewedProductVariant(variant);
    });
    return () => {
      emitter?.off('VIEW_PRODUCT_PAGE', (variant: ProductVariant) => {
        setViewedProductVariant(variant);
      });
    };
  }, []);

  // Trigger 'user_data' and 'view_item' events on viewedProductVariant change after base data is ready
  useEffect(() => {
    const pageHandle = pathWithoutLocalePrefix(window.location.pathname)
      .split('/')
      .pop();
    if (
      !userProperties ||
      !viewedProductVariant ||
      productHandleRef.current === pageHandle
    )
      return;
    userDataEvent({userProperties});
    viewProductEvent({variant: viewedProductVariant, userProperties});
    productHandleRef.current = pageHandle || null;
  }, [viewedProductVariant?.product?.id, !!userProperties]);
}
