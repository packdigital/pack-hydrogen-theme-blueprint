import {useEffect, useState} from 'react';

import {AnalyticsEvent} from '../constants';

import {viewProductEvent, addToCartEvent, ANALYTICS_NAME} from './events';

type Data = Record<string, any>;

const SCRIPTS_LOADED: Record<string, boolean> = {};

export function MetaPixelEvents({
  metaPixelId,
  register,
  subscribe,
  customer,
  debug = false,
}: {
  metaPixelId: string;
  register: (key: string) => {ready: () => void};
  subscribe: (arg0: any, arg1: any) => void;
  customer?: Record<string, any> | null;
  debug?: boolean;
}) {
  let ready: () => void = () => {};
  if (register) {
    ready = register(ANALYTICS_NAME).ready;
  }

  const [scriptLoaded, setScriptLoaded] = useState(false);

  /* Inject Meta Pixel script and set state when successful */
  useEffect(() => {
    if (!metaPixelId) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`metaPixelId\` must be passed in.`,
      );
    }
    const scriptId = 'meta-pixel-script';
    if (!SCRIPTS_LOADED[scriptId]) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
      SCRIPTS_LOADED[scriptId] = true;
      if (debug) console.log(`${ANALYTICS_NAME}: 📝 script is loaded.`);
    }
    setScriptLoaded(true);
  }, [metaPixelId, debug]);

  useEffect(() => {
    if (!metaPixelId) return;
    if (!ready || !subscribe) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`register\` and \`subscribe\` must be passed in from Hydrogen's useAnalytics hook.`,
      );
      return;
    }
    /* register analytics events only until script is ready */
    if (!scriptLoaded) return;
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      viewProductEvent({...data, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      addToCartEvent({...data, customer, debug});
    });
    ready();
    if (debug) console.log(`${ANALYTICS_NAME}: 🔄 subscriptions are ready.`);
  }, [scriptLoaded, customer?.id, debug]);

  return null;
}
