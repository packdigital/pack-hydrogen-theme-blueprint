import {useEffect, useState} from 'react';

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
  clickProductVariantEvent,
  customerEvent,
  customerLogInEvent,
  customerRegisterEvent,
  customerSubscribeEvent,
  ANALYTICS_NAME,
} from './events';

type Data = Record<string, any>;

const SCRIPTS_LOADED: Record<string, boolean> = {};

export function GA4Events({
  ga4TagId,
  register,
  subscribe,
  customer,
  debug = false,
}: {
  ga4TagId: string;
  register: (key: string) => {ready: () => void};
  subscribe: (arg0: any, arg1: any) => void;
  customer?: Record<string, any> | null;
  debug?: boolean;
}) {
  let ready: (() => void) | undefined = undefined;
  if (register) {
    ready = register(ANALYTICS_NAME).ready;
  }

  const [scriptLoaded, setScriptLoaded] = useState(false);

  /* Inject GA4 script and set state when successful */
  useEffect(() => {
    if (!ga4TagId) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`ga4TagId\` must be passed in.`,
      );
    }
    const scriptId = 'ga4-script';
    if (!SCRIPTS_LOADED[scriptId]) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4TagId}`;
      script.setAttribute('async', '');
      document.head.appendChild(script);
      SCRIPTS_LOADED[scriptId] = true;
    }
    const configScriptId = 'ga4-config';
    if (!SCRIPTS_LOADED[configScriptId]) {
      const configScript = document.createElement('script');
      configScript.id = configScriptId;
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ga4TagId}');
      `;
      document.head.appendChild(configScript);
      SCRIPTS_LOADED[configScriptId] = true;
      if (SCRIPTS_LOADED[scriptId]) {
        if (debug) console.log(`${ANALYTICS_NAME}: 📝 script is loaded.`);
      }
    }
    setScriptLoaded(true);
  }, [ga4TagId, debug]);

  useEffect(() => {
    if (!ga4TagId) return;
    if (!ready || !subscribe) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`register\` and \`subscribe\` must be passed in from Hydrogen's useAnalytics hook.`,
      );
      return;
    }
    /* register analytics events only until script is ready */
    if (!scriptLoaded) return;
    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: Data) => {
      viewPageEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      viewProductEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.COLLECTION_VIEWED, (data: Data) => {
      viewCollectionEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.SEARCH_VIEWED, (data: Data) => {
      viewSearchResultsEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.CART_VIEWED, (data: Data) => {
      viewCartEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_VARIANT_SELECTED, (data: Data) => {
      clickProductVariantEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ITEM_CLICKED, (data: Data) => {
      clickProductItemEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      addToCartEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, (data: Data) => {
      removeFromCartEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER, (data: Data) => {
      customerEvent({...data, debug});
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
  }, [scriptLoaded, customer?.id, debug]);

  useEffect(() => {
    if (!customer || !ga4TagId) return;
    if (window.gtag) {
      window.gtag('config', `${ga4TagId}`, {
        user_id: customer.id?.split('/').pop() || '',
      });
    }
  }, [customer?.id, ga4TagId]);

  return null;
}
