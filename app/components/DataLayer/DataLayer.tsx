import {useEffect, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {Script} from '@shopify/hydrogen';

import {useLocale, useRootLoaderData} from '~/hooks';

import {
  useDataLayerAccount,
  useDataLayerCart,
  useDataLayerCollection,
  useDataLayerCustomer,
  useDataLayerEvent,
  useDataLayerInit,
  useDataLayerProduct,
  useDataLayerSearch,
  useDataLayerSubscribe,
} from './hooks';

/*
 * Env to set, only if applicable:
 * PUBLIC_ELEVAR_SIGNING_KEY // enables Elevar data layer, e.g. 1234567890
 * --> from the url within the `fetch()` call in the script, take the unique string of characters in between `/configs/` and `/config.json`
 * PUBLIC_GA4_TAG_ID // enables GA4 analytics, e.g. G-XXXXXXXXXX
 */

const DEBUG = true;

export function DataLayer() {
  const {ENV} = useRootLoaderData();
  const {currency: currencyCode} = useLocale();
  const {handleDataLayerEvent} = useDataLayerEvent({DEBUG, ENV});
  const {status} = useCart();

  const cartIsIdle = status === 'idle';
  const [cartReady, setCartReady] = useState(cartIsIdle);

  useEffect(() => {
    if (cartIsIdle) {
      setCartReady(true);
    } else {
      // uninitialized cart never becomes idle so instead set cart ready after 1 sec
      setTimeout(() => setCartReady(true), 1000);
    }
  }, [cartIsIdle]);

  const {generateUserProperties, userProperties} = useDataLayerInit({
    handleDataLayerEvent,
  });

  const {userDataEvent, userDataEventTriggered} = useDataLayerCustomer({
    cartReady,
    currencyCode,
    handleDataLayerEvent,
    userProperties,
  });

  useDataLayerAccount({
    currencyCode,
    generateUserProperties,
    handleDataLayerEvent,
    userDataEvent,
    userDataEventTriggered,
  });

  useDataLayerCart({
    cartReady,
    currencyCode,
    handleDataLayerEvent,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerProduct({
    cartReady,
    handleDataLayerEvent,
    userDataEvent,
    userProperties,
  });

  useDataLayerCollection({
    cartReady,
    handleDataLayerEvent,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerSearch({
    cartReady,
    handleDataLayerEvent,
    userDataEvent,
    userDataEventTriggered,
    userProperties,
  });

  useDataLayerSubscribe({
    handleDataLayerEvent,
    userDataEventTriggered,
  });

  if (ENV?.PUBLIC_ELEVAR_SIGNING_KEY) {
    return (
      <Script
        type="module"
        id="elevar-script"
        dangerouslySetInnerHTML={{
          __html: `try {
            const settings = {};
            const config = (await import("https://shopify-gtm-suite.getelevar.com/configs/${ENV.PUBLIC_ELEVAR_SIGNING_KEY}/config.js")).default;
            const scriptUrl = settings.proxyPath
              ? settings.proxyPath + config.script_src_custom_pages_proxied
              : config.script_src_custom_pages;

            if (scriptUrl) {
              const { handler } = await import(scriptUrl);
              await handler(config, settings);
            }
          } catch (error) {
            console.error("Elevar Error:", error);
          }`,
        }}
      />
    );
  }

  if (ENV?.PUBLIC_GA4_TAG_ID) {
    return (
      <>
        <Script
          id="gtag-script"
          type="text/javascript"
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${ENV.PUBLIC_GA4_TAG_ID}`}
        />

        <Script
          id="gtag-config"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ENV.PUBLIC_GA4_TAG_ID}');
            `,
          }}
        />
      </>
    );
  }

  return null;
}

DataLayer.displayName = 'DataLayer';
