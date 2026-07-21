import {useEffect, useMemo, useRef, useState} from 'react';
import type {Customer} from '@shopify/hydrogen/customer-account-api-types';

import {useLoadScript} from '~/hooks';

import {AnalyticsEvent} from '../constants';

import {
  viewPageEvent,
  viewProductEvent,
  addToCartEvent,
  customerEvent,
  customerRegisterEvent,
  customerSubscribeEvent,
  ANALYTICS_NAME,
} from './events';

type Data = Record<string, any>;

export function BlotoutEvents({
  blotoutEdgeUrl,
  register,
  subscribe,
  customer,
  debug = false,
}: {
  blotoutEdgeUrl: string;
  register: (key: string) => {ready: () => void};
  subscribe: (arg0: any, arg1: any) => void;
  customer?: Customer | null;
  debug?: boolean;
}) {
  let ready: (() => void) | undefined = undefined;
  if (register) {
    ready = register(ANALYTICS_NAME).ready;
  }

  const [edgeTagInitialized, setEdgeTagInitialized] = useState(false);

  // Keep the latest customer in a ref so the subscribe-once effect below reads
  // current customer data without re-subscribing on every login/logout (which
  // would stack duplicate handlers — Hydrogen's subscribe has no unsubscribe).
  const customerRef = useRef(customer);
  useEffect(() => {
    customerRef.current = customer;
  }, [customer]);

  const edgeURL = useMemo(() => {
    try {
      return new URL(blotoutEdgeUrl).origin;
    } catch (error) {
      return undefined;
    }
  }, [blotoutEdgeUrl]);

  const edgeScriptStatus = useLoadScript({
    id: 'edge-tag-script',
    src: `${edgeURL}/load`,
  });

  useLoadScript(
    {
      id: 'edge-tag-function',
      innerHTML: `window.edgetag=window.edgetag||function(){(edgetag.stubs=edgetag.stubs||[]).push(arguments)};`,
    },
    'head',
  );

  useEffect(() => {
    if (!edgeURL) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: valid \`blotoutEdgeUrl\` must be passed in.`,
      );
      return;
    }
    if (edgeTagInitialized || edgeScriptStatus !== 'done') return;
    if (!window.edgetag) {
      console.error(`${ANALYTICS_NAME}: ❌ error: \`edgetag\` is not defined.`);
      return;
    }
    window.edgetag('init', {
      edgeURL,
      disableConsentCheck: typeof window.OneTrust === 'undefined',
    });
    setEdgeTagInitialized(true);
    if (debug) console.log(`${ANALYTICS_NAME}: 📝 script is loaded.`);
  }, [edgeScriptStatus, edgeURL]);

  useEffect(() => {
    if (!edgeTagInitialized) return;
    if (!ready || !subscribe) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`register\` and \`subscribe\` must be passed in from Hydrogen's useAnalytics hook.`,
      );
      return;
    }
    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: Data) => {
      viewPageEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      viewProductEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      addToCartEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER, (data: Data) => {
      customerEvent({...data, customer: customerRef.current, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_REGISTERED, (data: Data) => {
      customerRegisterEvent({...data, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_SUBSCRIBED, (data: Data) => {
      customerSubscribeEvent({...data, debug});
    });
    ready();
    if (debug) console.log(`${ANALYTICS_NAME}: 🔄 subscriptions are ready.`);
  }, [edgeTagInitialized]);

  return null;
}
