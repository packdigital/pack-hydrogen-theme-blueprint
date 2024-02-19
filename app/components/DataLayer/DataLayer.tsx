import {Script} from '@shopify/hydrogen';

import {useLocale, useRootLoaderData} from '~/hooks';

import {
  useDataLayerAccount,
  useDataLayerCart,
  useDataLayerCollection,
  useDataLayerCustomer,
  useDataLayerInit,
  useDataLayerProduct,
  useDataLayerSearch,
  useDataLayerSubscribe,
} from './hooks';

// Envs to set:
// * PUBLIC_GA4_TAG_ID // enables GA4 analytics, e.g. G-XXXXXXXXXX

const DEBUG = true;

export function DataLayer() {
  const {ENV} = useRootLoaderData();
  const {currency: currencyCode} = useLocale();

  const {generateUserProperties, userProperties} = useDataLayerInit({
    DEBUG,
  });

  const {userDataEvent, userDataEventTriggered} = useDataLayerCustomer({
    currencyCode,
    DEBUG,
    userProperties,
  });

  useDataLayerAccount({
    currencyCode,
    DEBUG,
    generateUserProperties,
    userDataEvent,
    userDataEventTriggered,
  });

  useDataLayerCart({
    currencyCode,
    DEBUG,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerProduct({
    DEBUG,
    userDataEvent,
    userProperties,
  });

  useDataLayerCollection({
    DEBUG,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerSearch({
    DEBUG,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerSubscribe({
    DEBUG,
    userDataEventTriggered,
  });

  return (
    <>
      {ENV.PUBLIC_GA4_TAG_ID && (
        <Script
          id="gtag-script"
          type="text/javascript"
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${ENV.PUBLIC_GA4_TAG_ID}`}
        />
      )}

      <Script
        id="gtag-config"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            if (${!!ENV.PUBLIC_GA4_TAG_ID}) {
              gtag('js', new Date());
              gtag('config', '${ENV.PUBLIC_GA4_TAG_ID}');
            }
          `,
        }}
      />
    </>
  );
}

DataLayer.displayName = 'DataLayer';
