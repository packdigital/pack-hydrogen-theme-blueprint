import {useEffect, useRef} from 'react';
import {useLocation} from '@remix-run/react';
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  useShopifyCookies,
} from '@shopify/hydrogen';

import {useAddToCartAnalytics} from './useAddToCartAnalytics';
import {usePageAnalytics} from './usePageAnalytics';

const DEBUG = true;
const hasUserConsent = true;

export function Analytics() {
  useShopifyCookies({hasUserConsent});

  const {pathname} = useLocation();
  const lastLocationKey = useRef<string>('');
  const pageAnalytics = usePageAnalytics({hasUserConsent});

  useAddToCartAnalytics({pageAnalytics, DEBUG});

  useEffect(() => {
    if (lastLocationKey.current === pathname) return;

    lastLocationKey.current = pathname;

    const sendPageViewAnalytics = async () => {
      const event = {
        eventName: AnalyticsEventName.PAGE_VIEW,
        payload: {
          ...getClientBrowserParameters(),
          ...pageAnalytics,
        },
      };
      await sendShopifyAnalytics(event);
      if (DEBUG) console.log('sendShopifyAnalytics:page_view', event);
    };
    sendPageViewAnalytics();
  }, [pathname, pageAnalytics]);

  return null;
}
