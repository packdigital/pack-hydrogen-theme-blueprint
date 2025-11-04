import {useMemo} from 'react';
import {CartProvider, ShopifyProvider} from '@shopify/hydrogen-react';
import type {ReactNode} from 'react';

import {CART_FRAGMENT} from '~/data/graphql/storefront/cart';
import {useLocale, useRootLoaderData} from '~/hooks';
import {DEFAULT_STOREFRONT_API_VERSION} from '~/lib/constants';

export function PreviewModeCartProvider({children}: {children: ReactNode}) {
  const {ENV, isPreviewModeEnabled} = useRootLoaderData();
  const locale = useLocale();

  const clientSideCartFragment = useMemo(() => {
    return CART_FRAGMENT.replace('CartApiQuery', 'CartFragment');
  }, [CART_FRAGMENT]);

  if (isPreviewModeEnabled) {
    return (
      <ShopifyProvider
        storeDomain={`https://${ENV.PUBLIC_STORE_DOMAIN}`}
        storefrontToken={ENV.PUBLIC_STOREFRONT_API_TOKEN}
        storefrontApiVersion={
          ENV.PUBLIC_STOREFRONT_API_VERSION || DEFAULT_STOREFRONT_API_VERSION
        }
        countryIsoCode={locale.country}
        languageIsoCode={locale.language}
      >
        <CartProvider cartFragment={clientSideCartFragment}>
          {children}
        </CartProvider>
      </ShopifyProvider>
    );
  }

  return children;
}

PreviewModeCartProvider.displayName = 'PreviewModeCartProvider';
