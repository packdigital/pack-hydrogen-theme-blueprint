import {useCallback} from 'react';
import {v4 as uuidv4} from 'uuid';

// /**
//  * Hook that returns whether the app has been hydrated (mounted)
//  * @returns {boolean} whether the app has been hydrated
//  */

export function useDataLayerEvent({
  DEBUG,
  ENV,
}: {
  DEBUG: boolean;
  ENV: Record<string, string>;
}): {
  handleDataLayerEvent: (event: Record<string, any>) => void;
} {
  const handleDataLayerEvent = useCallback(
    (baseEvent: Record<string, any>) => {
      if (!baseEvent) return;
      let event = baseEvent;

      /* Elevar */
      if (ENV?.PUBLIC_ELEVAR_SIGNING_KEY) {
        if (event.event === 'dl_route_update') {
          if (!window.ElevarInvalidateContext) return;
          window.ElevarInvalidateContext();
          if (DEBUG) console.log('DataLayer:elevar:pushContext');
          return;
        }
        window.ElevarDataLayer = window.ElevarDataLayer ?? [];
        window.ElevarDataLayer.push(event);
        if (DEBUG) console.log(`DataLayer:elevar:${event.event}`, event);
        return;
      }

      event = {
        ...event,
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        ecommerce: {
          ...event.ecommerce,
          app_id: 'hydrogen',
        },
      };

      /* Google Analytics (GA4) */
      if (ENV?.PUBLIC_GA4_TAG_ID) {
        if (window.gtag) window.gtag('event', event.event, event);
        if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
        return;
      }

      /* Event Listeners / dataLayer push */
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(event);
      window.dispatchEvent(
        new CustomEvent(event.event, {
          detail: event,
        }),
      );
      if (DEBUG) console.log(`DataLayer:dispatch:${event.event}`, event);
    },
    [ENV],
  );

  return {handleDataLayerEvent};
}
