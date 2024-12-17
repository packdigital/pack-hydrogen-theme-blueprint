import {memo} from 'react';
import {Analytics as HydrogenAnalytics, useAnalytics} from '@shopify/hydrogen';
import {useCart} from '@shopify/hydrogen-react';

import {
  useCustomer,
  useGlobal,
  usePathStorage,
  useRootLoaderData,
} from '~/hooks';

import {AnalyticsEvent} from './constants';
import {ElevarEvents} from './ElevarEvents';
import {FueledEvents} from './FueledEvents';
import {GA4Events} from './GA4Events';
import {MetaPixelEvents} from './MetaPixelEvents';
import {TikTokPixelEvents} from './TikTokPixelEvents';

const DEBUG =
  typeof document !== 'undefined' &&
  window.ENV?.PUBLIC_PACK_ANALYTICS_DEBUG === 'true';

export const Analytics = memo(() => {
  const {ENV} = useRootLoaderData();
  const {register, subscribe} = useAnalytics();
  const {isCartReady} = useGlobal();
  const cart = useCart();
  const customer = useCustomer();
  usePathStorage();

  const enabledFueled = false;
  const enabledElevar = !!ENV.PUBLIC_ELEVAR_SIGNING_KEY;
  const enabledGA4 = !!ENV.PUBLIC_GA4_TAG_ID;
  const enabledMetaPixel = !!ENV.PUBLIC_META_PIXEL_ID;
  const enabledTikTokPixel = !!ENV.PUBLIC_TIKTOK_PIXEL_ID;

  const customerPending = typeof customer === 'undefined';

  return (
    <>
      {enabledFueled && (
        <FueledEvents
          register={register}
          subscribe={subscribe}
          customer={customer}
          debug={DEBUG}
        />
      )}

      {enabledElevar && (
        <ElevarEvents
          elevarSigningKey={ENV.PUBLIC_ELEVAR_SIGNING_KEY}
          register={register}
          subscribe={subscribe}
          customer={customer}
          debug={DEBUG}
        />
      )}

      {enabledGA4 && (
        <GA4Events
          ga4TagId={ENV.PUBLIC_GA4_TAG_ID}
          register={register}
          subscribe={subscribe}
          debug={DEBUG}
        />
      )}

      {enabledMetaPixel && (
        <MetaPixelEvents
          metaPixelId={ENV.PUBLIC_META_PIXEL_ID}
          register={register}
          subscribe={subscribe}
          customer={customer}
          debug={DEBUG}
        />
      )}

      {enabledTikTokPixel && (
        <TikTokPixelEvents
          tiktokPixelId={ENV.PUBLIC_TIKTOK_PIXEL_ID}
          register={register}
          subscribe={subscribe}
          customer={customer}
          debug={DEBUG}
        />
      )}

      {isCartReady && !customerPending && (
        <HydrogenAnalytics.CustomView
          type={AnalyticsEvent.CUSTOMER}
          customData={{customer, cart}}
        />
      )}
    </>
  );
});
