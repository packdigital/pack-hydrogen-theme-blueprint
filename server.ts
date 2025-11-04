// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {
  createCartHandler,
  createCustomerAccountClient,
  cartGetIdDefault,
  cartSetIdDefault,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
} from '@shopify/remix-oxygen';
import {createPackClient, PackSession, handleRequest} from '@pack/hydrogen';

import {AppSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/server-utils/locale.server';
import {getCookieDomain} from '~/lib/server-utils/app.server';
import {getOxygenEnv} from '~/lib/server-utils/oxygen.server';
import {createAdminClient, getAdminHeaders} from '~/lib/admin-api';
import {CART_FRAGMENT} from '~/data/graphql/storefront/cart';
import defaultThemeData from '~/config/default-theme-data.json';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('`SESSION_SECRET` environment variable is not set.');
      }

      const waitUntil = (p: Promise<any>) => executionContext.waitUntil(p);
      const [cache, session, packSession] = await Promise.all([
        caches.open('hydrogen'),
        AppSession.init(request, [env.SESSION_SECRET]),
        PackSession.init(request, [env.SESSION_SECRET]),
      ]);

      /**
       * Get Oxygen Environment data.
       */
      const oxygen = getOxygenEnv(request);

      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: getLocaleFromRequest(request),
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /**
       * Create a client for Customer Account API.
       */
      const customerAccount = createCustomerAccountClient({
        waitUntil,
        request,
        session,
        customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        shopId: env.SHOP_ID,
      });

      /**
       * Create Admin API client.
       */
      let admin = undefined;
      if (env.PRIVATE_ADMIN_API_TOKEN) {
        const {admin: adminClient} = createAdminClient({
          cache,
          waitUntil,
          i18n: getLocaleFromRequest(request),
          privateAdminToken: env.PRIVATE_ADMIN_API_TOKEN,
          storeDomain: env.PUBLIC_STORE_DOMAIN,
          storefrontId: env.PUBLIC_STOREFRONT_ID,
          adminHeaders: getAdminHeaders(request),
        });
        admin = adminClient;
      } else {
        console.warn(
          '`PRIVATE_ADMIN_API_TOKEN` environment variable is not set. Admin API features will be disabled, including previewing draft products while in the customizer.',
        );
      }

      /*
       * Create cart handler.
       */
      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault({domain: getCookieDomain(request.url)}),
        cartQueryFragment: CART_FRAGMENT,
      });

      /**
       * Create Pack client.
       */

      // check if the PACK_SECRET_TOKEN is set
      if (!env.PACK_SECRET_TOKEN) {
        throw new Error('`PACK_SECRET_TOKEN` environment variable is not set.');
      }

      const pack = createPackClient({
        cache,
        waitUntil,
        token: env.PACK_SECRET_TOKEN,
        storeId: env.PACK_STOREFRONT_ID,
        session: packSession,
        contentEnvironment: env.PUBLIC_PACK_CONTENT_ENVIRONMENT,
        defaultThemeData,
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const response = await handleRequest(
        pack,
        request,
        createRequestHandler({
          build: remixBuild,
          mode: process.env.NODE_ENV,
          getLoadContext: () => ({
            cache,
            waitUntil,
            session,
            storefront,
            customerAccount,
            admin,
            cart,
            env,
            oxygen,
            pack,
          }),
        }),
      );

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred.', {status: 500});
    }
  },
};
