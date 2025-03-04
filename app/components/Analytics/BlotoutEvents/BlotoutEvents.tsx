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

  useLoadScript(
    {
      id: 'onetrust-consent-script',
      innerHTML: `var marketingOrTargetingChannels = [
      'facebook',
      'tiktok',
      'pinterest',
      'googleAds',
      'googleAdsClicks',
      'segment',
      'iterable',
      'snapchat',
      'tradeDesk',
      'twitter',
    ];
    var analyticsChannels = ['googleAnalytics4'];
    var getConsent = () => {
      const name = 'OptanonConsent';
      const cookie = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (cookie && cookie.length > 2) {
        const match = decodeURIComponent(cookie[2]).match(
          new RegExp('&groups=([^&]+)')
        );
        if (match) return match[1];
      }
    };
    var reduceChannelsToObj = (channels, value) => {
      return channels.reduce((obj, channel) => {
        obj[channel] = value;
        return obj;
      }, {});
    };
    var isCategoryEnabled = (consent, regrex) => {
      /*
        return
            -1 -> group is not found
            0 -> group is found but consent is false
            1 -> group is found and consent is true
      */
      let isEnabled = -1;
      OneTrust.GetDomainData()?.Groups?.forEach((group) => {
        if (group.GroupName?.match(regrex)) {
          if (consent[group.OptanonGroupId]) {
            isEnabled = 1; // Opt-in by user
          } else {
            isEnabled = ~isEnabled ? isEnabled : 0; // Opt-out by user
          }
        }
      });
      return isEnabled;
    };
    var isMarketingOrTargetingEnabled = (consent) => {
      const isTargetingEnabled = isCategoryEnabled(consent, /targeting/i);
      const isMarketingEnabled = isCategoryEnabled(consent, /marketing/i);
      if (isMarketingEnabled === 1 || isTargetingEnabled === 1) {
        return true;
      }
      return isTargetingEnabled & isMarketingEnabled;
    };
    window.addEventListener('load', () => {
      if (typeof window.OneTrust !== 'undefined') {
        OneTrust.OnConsentChanged(function () {
          const consentString = getConsent();
          if (!consentString) {
            return;
          }
          const consent = consentString.split(',').reduce((obj, group) => {
            const [groupId, groupConsentValue] = group.split(':');
            obj[groupId] = parseInt(groupConsentValue);
            return obj;
          }, {});
          const isAnalyticsEnabled = isCategoryEnabled(consent, /analytics/i);
          let edgetagConsent = { all: true };
          if (!isMarketingOrTargetingEnabled(consent)) {
            edgetagConsent = {
              ...edgetagConsent,
              ...reduceChannelsToObj(marketingOrTargetingChannels, false),
            };
          }
          if (!isAnalyticsEnabled) {
            edgetagConsent = {
              ...edgetagConsent,
              ...reduceChannelsToObj(analyticsChannels, false),
            };
          }
          edgetag('consent', edgetagConsent);
        });
      }
    });`,
    },
    'body',
    !!edgeTagInitialized,
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
