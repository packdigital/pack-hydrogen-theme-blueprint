import {useEffect, useMemo, useState} from 'react';

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
  customer?: Record<string, any> | null;
  debug?: boolean;
}) {
  let ready: (() => void) | undefined = undefined;
  if (register) {
    ready = register(ANALYTICS_NAME).ready;
  }

  const [edgeTagInitialized, setEdgeTagInitialized] = useState(false);

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
      viewPageEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      viewProductEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      addToCartEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER, (data: Data) => {
      customerEvent({...data, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_REGISTERED, (data: Data) => {
      customerRegisterEvent({...data, debug});
    });
    subscribe(AnalyticsEvent.CUSTOMER_SUBSCRIBED, (data: Data) => {
      customerSubscribeEvent({...data, debug});
    });
    ready();
    if (debug) console.log(`${ANALYTICS_NAME}: 🔄 subscriptions are ready.`);
  }, [customer?.id, debug, edgeTagInitialized]);

  return null;
}
