import {useEffect, useRef, useState} from 'react';
import type {Customer} from '@shopify/hydrogen/customer-account-api-types';

import {AnalyticsEvent} from '../constants';

import {
  viewPageEvent,
  viewProductEvent,
  viewCartEvent,
  viewCollectionEvent,
  viewSearchResultsEvent,
  addToCartEvent,
  removeFromCartEvent,
  clickProductItemEvent,
  customerEvent,
  customerLogInEvent,
  customerRegisterEvent,
  customerSubscribeEvent,
  ANALYTICS_NAME,
} from './events';

/*
 * Env to set:
 * PUBLIC_ELEVAR_SIGNING_KEY // enables Elevar data layer, e.g. 1234567890
 * --> from the url within the `fetch()` call in the script, take the unique string of characters in between `/configs/` and `/config.json`
 * Elevar Debugger (paste into dev tools console):
 * Turn on: window.ElevarDebugMode(true);
 * Turn off: window.ElevarDebugMode(false);
 */

type Data = Record<string, any>;

const SCRIPTS_LOADED: Record<string, boolean> = {};

export function ElevarEvents({
  elevarSigningKey,
  register,
  subscribe,
  customer,
  debug = false,
}: {
  elevarSigningKey: string;
  register: (key: string) => {ready: () => void};
  subscribe: (arg0: any, arg1: any) => void;
  customer?: Customer | null;
  debug?: boolean;
}) {
  let ready: (() => void) | undefined = undefined;
  if (register) {
    ready = register(ANALYTICS_NAME).ready;
  }

  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Keep the latest customer in a ref so the subscribe-once effect below reads
  // current customer data without re-subscribing on every login/logout (which
  // would stack duplicate handlers — Hydrogen's subscribe has no unsubscribe).
  const customerRef = useRef(customer);
  useEffect(() => {
    customerRef.current = customer;
  }, [customer]);

  /* Inject Elevar script and set state when successful */
  useEffect(() => {
    if (!elevarSigningKey) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`elevarSigningKey\` must be passed in.`,
      );
      return;
    }
    const scriptId = 'elevar-script';
    const loadElevar = async () => {
      try {
        const settings: Record<string, any> = {};
        const config = (
          await import(
            /* @vite-ignore */
            `https://shopify-gtm-suite.getelevar.com/configs/${elevarSigningKey}/config.js`
          )
        ).default;
        const scriptUrl = settings.proxyPath
          ? settings.proxyPath + config.script_src_custom_pages_proxied
          : config.script_src_custom_pages;

        if (scriptUrl) {
          const {handler} = await import(
            /* @vite-ignore */
            scriptUrl
          );
          await handler(config, settings);
        }
        setScriptLoaded(true);
        SCRIPTS_LOADED[scriptId] = true;
        if (debug) console.log(`${ANALYTICS_NAME}: 📝 script is loaded.`);
      } catch (error) {
        console.error('Elevar Error:', error);
      }
    };
    if (!SCRIPTS_LOADED[scriptId]) {
      loadElevar();
    }
  }, [elevarSigningKey, debug]);

  useEffect(() => {
    if (!elevarSigningKey) return;
    if (!ready || !subscribe) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`register\` and \`subscribe\` must be passed in from Hydrogen's useAnalytics hook.`,
      );
      return;
    }
    /* register analytics events only until script is ready */
    if (!scriptLoaded) return;
    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: Data) => {
      viewPageEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      viewProductEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.COLLECTION_VIEWED, (data: Data) => {
      viewCollectionEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.SEARCH_VIEWED, (data: Data) => {
      viewSearchResultsEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.CART_VIEWED, (data: Data) => {
      viewCartEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ITEM_CLICKED, (data: Data) => {
      clickProductItemEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      addToCartEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, (data: Data) => {
      removeFromCartEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER, (data: Data) => {
      customerEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_LOGGED_IN, (data: Data) => {
      customerLogInEvent({...data, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_REGISTERED, (data: Data) => {
      customerRegisterEvent({...data, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_SUBSCRIBED, (data: Data) => {
      customerSubscribeEvent({...data, debug});
    });
    ready();
    if (debug) console.log(`${ANALYTICS_NAME}: 🔄 subscriptions are ready.`);
  }, [scriptLoaded]);

  return null;
}
