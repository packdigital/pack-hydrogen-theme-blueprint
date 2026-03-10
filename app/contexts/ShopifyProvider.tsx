import {useMemo} from 'react';
import {
  CartProvider as HydrogenCartProvider,
  ShopifyProvider as HydrogenShopifyProvider,
} from '@shopify/hydrogen-react';
import type {ReactNode} from 'react';

import {CART_FRAGMENT} from '~/data/graphql/storefront/cart';
import {useLocale, useRootLoaderData} from '~/hooks';
import {DEFAULT_STOREFRONT_API_VERSION} from '~/lib/constants';

export function ShopifyProvider({children}: {children: ReactNode}) {
  const {ENV, isPreviewModeEnabled} = useRootLoaderData();
  const locale = useLocale();

  const previewModeCartFragment = useMemo(() => {
    return CART_FRAGMENT.replace('CartApiQuery', 'CartFragment');
  }, [CART_FRAGMENT]);

  return (
    <HydrogenShopifyProvider
      storeDomain={ENV.PUBLIC_STORE_DOMAIN}
      storefrontToken={ENV.PUBLIC_STOREFRONT_API_TOKEN}
      storefrontApiVersion={DEFAULT_STOREFRONT_API_VERSION}
      countryIsoCode={locale.country}
      languageIsoCode={locale.language}
    >
      {/* When in customizer (preview mode), use Hydrogen's client side cart provider */}
      {isPreviewModeEnabled ? (
        <HydrogenCartProvider cartFragment={previewModeCartFragment}>
          {children}
        </HydrogenCartProvider>
      ) : (
        children
      )}
    </HydrogenShopifyProvider>
  );
}

ShopifyProvider.displayName = 'ShopifyProvider';
