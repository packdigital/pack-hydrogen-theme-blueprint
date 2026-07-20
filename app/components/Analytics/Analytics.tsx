import {lazy, memo, Suspense} from 'react';
import {Analytics as HydrogenAnalytics, useAnalytics} from '@shopify/hydrogen';

import {
  useCart,
  useCustomer,
  useGlobal,
  usePathStorage,
  useRootLoaderData,
} from '~/hooks';

import {AnalyticsEvent} from './constants';

// Each pixel integration is its own chunk, loaded only when its ENV flag is
// enabled (see gates below). A store typically enables 1-2 of these, so the
// rest never ship to the client. The components render null / side-effects
// only, so a null Suspense fallback is invisible.
const BlotoutEvents = lazy(() =>
  import('./BlotoutEvents').then((m) => ({default: m.BlotoutEvents})),
);
const ElevarEvents = lazy(() =>
  import('./ElevarEvents').then((m) => ({default: m.ElevarEvents})),
);
const FueledEvents = lazy(() =>
  import('./FueledEvents').then((m) => ({default: m.FueledEvents})),
);
const GA4Events = lazy(() =>
  import('./GA4Events').then((m) => ({default: m.GA4Events})),
);
const KlaviyoEvents = lazy(() =>
  import('./KlaviyoEvents').then((m) => ({default: m.KlaviyoEvents})),
);
const MetaPixelEvents = lazy(() =>
  import('./MetaPixelEvents').then((m) => ({default: m.MetaPixelEvents})),
);
const TikTokPixelEvents = lazy(() =>
  import('./TikTokPixelEvents').then((m) => ({default: m.TikTokPixelEvents})),
);

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
  const enabledBlotout = !!ENV.PUBLIC_BLOTOUT_EDGE_URL;
  const enabledElevar = !!ENV.PUBLIC_ELEVAR_SIGNING_KEY;
  const enabledGA4 = !!ENV.PUBLIC_GA4_TAG_ID;
  const enabledKlaviyo = !!ENV.PUBLIC_KLAVIYO_API_KEY;
  const enabledMetaPixel = !!ENV.PUBLIC_META_PIXEL_ID;
  const enabledTikTokPixel = !!ENV.PUBLIC_TIKTOK_PIXEL_ID;

  return (
    <Suspense fallback={null}>
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

      {enabledKlaviyo && (
        <KlaviyoEvents
          klaviyoApiKey={ENV.PUBLIC_KLAVIYO_API_KEY}
          register={register}
          subscribe={subscribe}
          customer={customer}
          debug={DEBUG}
        />
      )}

      {enabledBlotout && (
        <BlotoutEvents
          blotoutEdgeUrl={ENV.PUBLIC_BLOTOUT_EDGE_URL}
          register={register}
          subscribe={subscribe}
          customer={customer}
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

      {isCartReady && (
        <HydrogenAnalytics.CustomView
          type={AnalyticsEvent.CUSTOMER}
          customData={{customer, cart}}
        />
      )}
    </Suspense>
  );
});
