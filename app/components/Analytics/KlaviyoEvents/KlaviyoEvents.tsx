import {useEffect} from 'react';

import {useLoadScript} from '~/hooks';

import {AnalyticsEvent} from '../constants';

import {
  ANALYTICS_NAME,
  addToCartEvent,
  customerSubscribeEvent,
  viewProductEvent,
} from './events';

type Data = Record<string, any>;

export function KlaviyoEvents({
  register,
  subscribe,
  customer,
  debug = false,
  klaviyoApiKey,
}: {
  register: (key: string) => {ready: () => void};
  subscribe: (arg0: any, arg1: any) => void;
  customer?: Record<string, any> | null;
  debug?: boolean;
  klaviyoApiKey: string;
}) {
  let ready: (() => void) | undefined = undefined;
  if (register) {
    ready = register(ANALYTICS_NAME).ready;
  }

  const scriptStatus = useLoadScript(
    {
      id: 'klaviyo-script',
      src: `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${klaviyoApiKey}`,
    },
    'body',
    !!klaviyoApiKey,
  );

  useEffect(() => {
    if (!klaviyoApiKey) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`klaviyoApiKey\` must be passed in.`,
      );
    }
    if (scriptStatus !== 'done') return;
    if (!ready || !subscribe) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`register\` and \`subscribe\` must be passed in from Hydrogen's useAnalytics hook.`,
      );
      return;
    }
    /* register analytics events only until script is ready */
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      viewProductEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      addToCartEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_SUBSCRIBED, (data: Data) => {
      customerSubscribeEvent({...data, debug});
    });
    ready();
    if (debug) console.log(`${ANALYTICS_NAME}: 🔄 subscriptions are ready.`);
  }, [customer?.id, debug, scriptStatus]);

  return null;
}
