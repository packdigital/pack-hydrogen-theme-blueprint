import {useEffect, useState} from 'react';
import type {Customer} from '@shopify/hydrogen/customer-account-api-types';

import {useLoadScript, useCart} from '~/hooks';

import {AnalyticsEvent} from '../constants';

import {
  collectionViewedEvent,
  pageViewedEvent,
  productAddedToCartEvent,
  productRemovedFromCartEvent,
  productViewedEvent,
  searchSubmittedEvent,
  type IntentnowTagScript,
} from './events';

/*
 * Env to set:
 * PUBLIC_INTENTNOW_STORE_API_KEY
 */

const ANALYTICS_NAME = 'IntentnowEvents';
type Data = Record<string, any>;

export function IntentnowEvents({
  register,
  subscribe,
  customer,
  debug = false,
  storeApiKey,
  myshopifyDomain,
  runWidget,
}: {
  register: (key: string) => {ready: () => void};
  subscribe: (arg0: any, arg1: any) => void;
  customer?: Customer | null;
  debug?: boolean;
  storeApiKey: string;
  myshopifyDomain: string;
  runWidget: boolean;
}) {
  const cart = useCart();

  let ready: (() => void) | undefined = undefined;
  if (register) {
    ready = register(ANALYTICS_NAME).ready;
  }

  function initIntentnow() {
    debug && console.log(`${ANALYTICS_NAME}: initializing...`);
    if (!ready || !subscribe) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`register\` and \`subscribe\` must be passed in from Hydrogen's useAnalytics hook.`,
      );
      return;
    }

    const intentnowTag = (window as any).IntentnowTag as
      | IntentnowTagScript
      | undefined;

    if (!intentnowTag) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`IntentnowTag\` is not initialized..`,
      );
      return;
    }

    intentnowTag.initializeHeadless({
      storeApiKey,
      myshopifyDomain,
      autoDomEvents: true, //automatically capture dom events (e.g., "clicked")
    });

    debug && console.log(`${ANALYTICS_NAME}: 📝 script is loaded.`);

    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: Data) => {
      pageViewedEvent({data, debug});

      //Trigger the Intentnow widget on page_viewed event.
      //You can choose to run the widget on other occassions as well.
      if (runWidget) {
        intentnowTag.runWidgetHeadless({
          isEnabled: () => {
            // Check if any discount code is already applied to the cart
            // Hide the widget if discount already applied
            // You can also implement other custom logic of your choice here

            const hasAppliedDiscount = (cart?.discountCodes || []).some(
              (discount: any) => discount.applicable,
            );
            debug &&
              console.log(
                `${ANALYTICS_NAME}: hasAppliedDiscount`,
                hasAppliedDiscount,
              );

            return !hasAppliedDiscount;
          },
        });
      }
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      productViewedEvent({data, debug});
    });
    subscribe(AnalyticsEvent.COLLECTION_VIEWED, (data: Data) => {
      collectionViewedEvent({data, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      productAddedToCartEvent({data, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, (data: Data) => {
      productRemovedFromCartEvent({data, debug});
    });

    subscribe(AnalyticsEvent.SEARCH_VIEWED, (data: Data) => {
      searchSubmittedEvent({data, debug});
    });

    ready();
    debug && console.log(`${ANALYTICS_NAME}: 🔄 subscriptions are ready.`);
  }

  const scriptStatus = useLoadScript(
    {
      id: 'intentnow-script',
      src: `https://app.intentnow.com/sdk/latest.js`,
    },
    'body',
    true,
  );

  useEffect(() => {
    if (scriptStatus !== 'done') return;
    return initIntentnow();
  }, [scriptStatus]);

  return null;
}
