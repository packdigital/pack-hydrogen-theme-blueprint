import type {ReactNode} from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import {Seo} from '@shopify/hydrogen';
import {CartProvider, ShopifyProvider} from '@shopify/hydrogen-react';
import {PreviewProvider} from '@pack/react';

import {GlobalProvider, GroupingsProvider} from '~/contexts';
import {CART_FRAGMENT} from '~/data/queries';
import {Analytics, DataLayer, Layout} from '~/components';
import {useLocale, useRootLoaderData} from '~/hooks';

import {Favicon} from './Favicon';
import {Scripts as RootScripts} from './Scripts';

interface DocumentProps {
  children: ReactNode;
  title?: string;
}

export function Document({children, title}: DocumentProps) {
  const {customizerMeta, ENV, isPreviewModeEnabled, siteSettings, siteTitle} =
    useRootLoaderData();
  const locale = useLocale();
  const keywords =
    siteSettings?.data?.siteSettings?.seo?.keywords?.join(', ') ?? '';

  return (
    <ShopifyProvider
      storeDomain={`https://${ENV.PUBLIC_STORE_DOMAIN}`}
      storefrontToken={ENV.PUBLIC_STOREFRONT_API_TOKEN}
      storefrontApiVersion={ENV.PUBLIC_STOREFRONT_API_VERSION || '2024-01'}
      countryIsoCode={locale.country}
      languageIsoCode={locale.language}
    >
      <CartProvider cartFragment={CART_FRAGMENT}>
        <GlobalProvider>
          <GroupingsProvider>
            <html lang="en">
              <head>
                {title && <title>{title}</title>}
                <meta charSet="utf-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
                <meta name="og:type" content="website" />
                <meta name="og:site_name" content={siteTitle} />
                <meta
                  name="og:locale"
                  content={`${locale.language}_${locale.country}`}
                />
                <meta name="keywords" content={keywords} />
                <Favicon />
                <Seo />
                <Meta />
                <Links />
              </head>

              <body>
                <PreviewProvider
                  customizerMeta={customizerMeta}
                  isPreviewModeEnabled={isPreviewModeEnabled}
                  siteSettings={siteSettings}
                >
                  <Layout key={`${locale.language}-${locale.country}`}>
                    {children}
                  </Layout>
                </PreviewProvider>
                <Analytics />
                <DataLayer />
                <RootScripts />
                <ScrollRestoration
                  getKey={(location) => {
                    const isPdp = location.pathname.startsWith('/products/');
                    return isPdp ? location.key : location.pathname;
                  }}
                />
                <Scripts />
                <LiveReload />
              </body>
            </html>
          </GroupingsProvider>
        </GlobalProvider>
      </CartProvider>
    </ShopifyProvider>
  );
}

Document.displayName = 'Document';
