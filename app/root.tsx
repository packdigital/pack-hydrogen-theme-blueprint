import {
  isRouteErrorResponse,
  Outlet,
  useMatches,
  useRouteError,
} from '@remix-run/react';
import {data as dataWithOptions, redirect} from '@shopify/remix-oxygen';
import type {ShouldRevalidateFunction} from '@remix-run/react';
import {
  getSeoMeta,
  getShopAnalytics,
  ShopifySalesChannel,
} from '@shopify/hydrogen';
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import type {
  Customer,
  CustomerAccessToken,
  Shop,
} from '@shopify/hydrogen/storefront-api-types';

import {
  ApplicationError,
  Document,
  NotFound,
  ServerError,
} from '~/components/Document';
import {validateCustomerAccessToken} from '~/lib/customer';
import {customerGetAction} from '~/lib/customer/servers/customer.server';
import {
  getCookieDomain,
  getPublicEnvs,
  getProductGroupings,
  getShop,
  getSiteSettings,
  redirectLinkToBuyerLocale,
  setPackCookie,
} from '~/lib/utils';
import {registerSections} from '~/sections';
import {registerStorefrontSettings} from '~/settings';
import {seoPayload} from '~/lib/seo.server';
import {getModalProduct} from '~/lib/products.server';
import type {RootSiteSettings} from '~/lib/types';
import styles from '~/styles/app.css?url';

registerSections();
registerStorefrontSettings();

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  defaultShouldRevalidate,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }
  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }
  return defaultShouldRevalidate;
};

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
    },
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront, session, oxygen, pack, env} = context;
  const isPreviewModeEnabled = pack.isPreviewModeEnabled() as boolean;

  /*
   * Redirect to the correct locale if the buyer's country is different from the
   * current locale. Occurs only once per cookie session
   */
  if (
    storefront.i18n.country !== oxygen.buyer.country &&
    !isPreviewModeEnabled
  ) {
    const redirectedLink = await redirectLinkToBuyerLocale({context, request});
    if (redirectedLink)
      return redirect(redirectedLink.to, redirectedLink.options);
  }

  const [shop, siteSettings, customerAccessToken, ENV]: [
    Shop,
    RootSiteSettings,
    CustomerAccessToken | undefined,
    Record<string, string>,
  ] = await Promise.all([
    getShop(context),
    getSiteSettings(context),
    session.get('customerAccessToken'),
    getPublicEnvs({context, request}),
  ]);

  const groupingsPromise = getProductGroupings(context);

  const {isLoggedIn, headers: headersWithAccessToken} =
    await validateCustomerAccessToken(session, customerAccessToken);
  let customer: Customer | null = null;
  if (isLoggedIn) {
    const {data: customerData} = await customerGetAction({context});
    if (customerData.customer) {
      customer = customerData.customer;
    }
  }
  const cookieDomain = getCookieDomain(request.url);
  const {headers: headersWithPackCookie} = await setPackCookie({
    cookieDomain,
    headers: headersWithAccessToken,
    request,
  });
  const headers = headersWithPackCookie;

  /* Get product if modalProduct url param is present */
  const {modalProduct, modalSelectedVariant} = await getModalProduct({
    context,
    request,
  });

  const analytics = {
    shopifySalesChannel: ShopifySalesChannel.hydrogen,
    shopId: shop.id,
  };
  const seo = seoPayload.root({
    shop,
    siteSettings,
    url: request.url,
  }) as Record<string, any>;
  const consent = {
    checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
    storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    withPrivacyBanner: true,
    country: storefront.i18n.country,
    language: storefront.i18n.language,
  };
  const shopAnalytics = getShopAnalytics({
    storefront,
    publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
  });
  const SITE_TITLE = siteSettings?.data?.siteSettings?.seo?.title || shop.name;

  return dataWithOptions(
    {
      analytics,
      consent,
      cookieDomain,
      customer,
      customerAccessToken,
      customizerMeta: pack.session.get('customizerMeta'),
      ENV: {...ENV, SITE_TITLE} as Record<string, string>,
      groupingsPromise,
      isPreviewModeEnabled,
      modalProduct,
      modalSelectedVariant,
      oxygen,
      selectedLocale: storefront.i18n,
      seo,
      shop: shopAnalytics,
      siteSettings,
      siteTitle: SITE_TITLE,
      url: request.url,
    },
    {headers},
  );
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);
  const [root] = useMatches();

  if (!root?.data) return <ServerError error={routeError} />;

  const title = isRouteError ? 'Not Found' : 'Application Error';

  return (
    <Document title={title}>
      {isRouteError ? <NotFound /> : <ApplicationError error={routeError} />}
    </Document>
  );
}
