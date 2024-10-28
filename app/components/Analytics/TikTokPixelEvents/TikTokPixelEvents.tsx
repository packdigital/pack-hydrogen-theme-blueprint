import {useEffect, useState} from 'react';

import {AnalyticsEvent} from '../constants';

import {viewProductEvent, addToCartEvent, ANALYTICS_NAME} from './events';

type Data = Record<string, any>;

const SCRIPTS_LOADED: Record<string, boolean> = {};

export function TikTokPixelEvents({
  tiktokPixelId,
  register,
  subscribe,
  customer,
  debug = false,
}: {
  tiktokPixelId: string;
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

  /* Inject TikTok Pixel script and set state when successful */
  useEffect(() => {
    if (!tiktokPixelId) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`tiktokPixelId\` must be passed in.`,
      );
    }
    const scriptId = 'tiktok-pixel-script';
    if (!SCRIPTS_LOADED[scriptId]) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.innerHTML = `
        !function (w, d, t) { w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
          ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
          for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
          ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
          var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
          var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)}; ttq.load('${tiktokPixelId}'); ttq.page(); }(window, document, 'ttq');
      `;
      document.head.appendChild(script);
      SCRIPTS_LOADED[scriptId] = true;
      if (debug) console.log(`${ANALYTICS_NAME}: 📝 script is loaded.`);
    }
    setScriptLoaded(true);
  }, [tiktokPixelId, debug]);

  useEffect(() => {
    if (!tiktokPixelId) return;
    if (!ready || !subscribe) {
      console.error(
        `${ANALYTICS_NAME}: ❌ error: \`register\` and \`subscribe\` must be passed in from Hydrogen's useAnalytics hook.`,
      );
      return;
    }
    /* register analytics events only until script is ready */
    if (!scriptLoaded) return;
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: Data) => {
      viewProductEvent({...data, tiktokPixelId, customer, debug});
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: Data) => {
      addToCartEvent({...data, tiktokPixelId, customer, debug});
    });
    ready();
    if (debug) console.log(`${ANALYTICS_NAME}: 🔄 subscriptions are ready.`);
  }, [tiktokPixelId, scriptLoaded, customer?.id, debug]);

  return null;
}
