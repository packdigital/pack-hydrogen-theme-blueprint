import {AnalyticsEvent} from '../constants';

import {
  flattenConnection,
  generateUserProperties,
  mapCartLine,
  mapProductItemVariant,
  mapProductPageVariant,
  mapProductItemProduct,
  pathWithoutLocalePrefix,
} from './utils';

export const ANALYTICS_NAME = 'ElevarEvents';

const PAGE_TYPES: Record<string, string> = {
  '/': 'home',
  '/account': 'customersAccount',
  '/account/activate': 'customersActivateAccount',
  '/account/addresses': 'customersAddresses',
  '/account/login': 'customersLogin',
  '/account/orders/': 'customersOrders',
  '/account/register': 'customersRegister',
  '/account/reset': 'customersResetPassword',
  '/articles': 'article',
  '/blogs': 'blog',
  '/cart': 'cart',
  '/collections': 'collection',
  '/not-found': 'notFound',
  '/pages': 'page',
  '/404': 'notFound',
  '/pages/privacy-policy': 'policy',
  '/pages/search': 'search',
  '/products': 'product',
  '/search': 'search',
};

const logSubscription = ({
  data,
  analyticsEvent,
}: {
  data: Record<string, any>;
  analyticsEvent: string;
}) => {
  console.log(
    `${ANALYTICS_NAME}: 📥 subscribed to analytics for \`${analyticsEvent}\`:`,
    data,
  );
};

const logError = ({
  analyticsEvent,
  message = 'Unknown error',
}: {
  analyticsEvent: string;
  message?: string | unknown;
}) => {
  console.error(
    `${ANALYTICS_NAME}: ❌ error from \`${analyticsEvent}\`: ${message}`,
  );
};

const emitEvent = ({
  event,
  debug,
  onEmit,
}: {
  event: Record<string, any>;
  debug?: boolean;
  onEmit?: (event: Record<string, any>) => void;
}) => {
  try {
    if (event.event === 'dl_route_update') {
      if (!window.ElevarInvalidateContext) return;
      window.ElevarInvalidateContext();
      if (typeof onEmit === 'function') onEmit(event);
      if (debug) console.log('ElevarEvents: ⏩ pushed context');
      return;
    }
    window.ElevarDataLayer = window.ElevarDataLayer ?? [];
    window.ElevarDataLayer.push(event);
    if (debug)
      console.log(
        `${ANALYTICS_NAME}: 🚀 event emitted for \`${event.event}\`:`,
        event,
      );
    if (typeof onEmit === 'function') onEmit(event);
  } catch (error) {
    logError({
      analyticsEvent: 'emitEvent',
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerEvent = ({
  onEmit,
  debug,
  ...data
}: Record<string, any> & {
  onEmit?: (event: Record<string, any>) => void;
  debug?: boolean;
}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer: providerCustomer, shop} = data;
    const {customer: customCustomer, cart} = data.customData;
    const customer =
      typeof customCustomer !== 'undefined' ? customCustomer : providerCustomer;
    if (typeof customer === 'undefined')
      throw new Error('`customer` parameter is missing in `customData`.');
    if (typeof cart === 'undefined')
      console.warn('`cart` parameter is missing in `customData`.');

    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
    const list =
      (windowPathname.startsWith('/collections') && windowPathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const event = {
      event: 'dl_user_data',
      user_properties: generateUserProperties({customer}),
      cart_total: cart?.cost?.totalAmount?.amount || '0.0',
      ecommerce: {
        currencyCode: cart?.cost?.totalAmount?.currencyCode || shop?.currency,
        cart_contents: {
          products:
            flattenConnection(cart?.lines)?.map(mapCartLine(list)) || [],
        },
      },
    };
    emitEvent({event, onEmit, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewPageEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PAGE_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {url, customer} = data;
    if (!url) throw new Error('`url` parameter is missing.');

    const newUrl = new URL(url);
    const {pathname, search} = newUrl;
    const pageType = pathname.startsWith('/account/orders/')
      ? PAGE_TYPES['/account/orders/']
      : PAGE_TYPES[pathname] ||
        PAGE_TYPES[pathname.split('/').slice(0, -1).join('/')] ||
        '';
    const event = {
      event: 'dl_route_update',
      user_properties: generateUserProperties({customer}),
      page: {
        path: pathname,
        title: document.title,
        type: pageType,
        search,
      },
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewProductEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer, shop} = data;
    const {product, selectedVariant} = data.customData;
    if (!product)
      throw new Error('`product` parameter is missing in `customData`.');

    let variant = selectedVariant;
    if (!variant) variant = flattenConnection(product.variants)?.[0];
    if (!variant) return;
    variant = {
      ...variant,
      image: variant.image || product.featuredImage,
      product: {
        ...variant.product,
        vendor: product.vendor,
        collections: product.collections,
      },
    };
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list = previousPath?.startsWith('/collections') ? previousPath : '';
    const event = {
      event: 'dl_view_item',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currencyCode: variant.price?.currencyCode || shop?.currency,
        detail: {
          actionField: {list, action: 'detail'},
          products: [variant].map(mapProductPageVariant(list)),
        },
      },
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewCollectionEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.COLLECTION_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer, shop} = data;
    const {collection} = data.customData;
    if (!collection)
      throw new Error('`collection` parameter is missing in `customData`.');

    const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
    const list = windowPathname.startsWith('/collections')
      ? windowPathname
      : '';
    const products = flattenConnection(collection.products);
    const event = {
      event: 'dl_view_item_list',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currencyCode:
          flattenConnection(products?.[0]?.variants)?.[0]?.price
            ?.currencyCode || shop?.currency,
        collection_title: collection.title,
        collection_id: collection.id?.split('/').pop(),
        impressions: products?.slice(0, 7).map(mapProductItemProduct(list)),
      },
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewSearchResultsEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.SEARCH_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {searchResults, searchTerm, customer, shop} = data;
    if (!searchResults || !searchTerm)
      throw new Error(
        '`searchTerm` and/or `searchResults` parameters are missing.',
      );

    const event = {
      event: 'dl_view_search_results',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currencyCode:
          flattenConnection(searchResults[0]?.variants)?.[0]?.price
            ?.currencyCode || shop?.currency,
        actionField: {
          list: 'search results',
          search_term: searchTerm,
        },
        impressions: searchResults.slice(0, 7).map(mapProductItemProduct()),
      },
    };
    // Elevar requires a `dl_user_data` event before `dl_view_search_results`
    customerEvent({
      ...data,
      customer: customer || null,
      onEmit: () => emitEvent({event, debug}),
      debug,
    });
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewCartEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CART_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {cart: providerCart, customer, shop, url} = data;
    const {cart: customCart} = data.customData;
    const cart = customCart || providerCart;

    let pathname = undefined;
    try {
      pathname = new URL(url).pathname;
    } catch (error) {}
    if (!cart && pathname === '/cart')
      throw new Error('`cart` parameter is missing in `customData`.');

    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list =
      (window.location.pathname.startsWith('/collections') &&
        window.location.pathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const cartCurrencyCode = cart?.cost?.totalAmount?.currencyCode;
    const event = {
      event: 'dl_view_cart',
      user_properties: generateUserProperties({customer}),
      cart_total: cart?.cost?.totalAmount?.amount || '0.0',
      ecommerce: {
        currencyCode:
          cartCurrencyCode && cartCurrencyCode !== 'XXX'
            ? cartCurrencyCode
            : shop?.currency,
        actionField: {list: 'Shopping Cart'},
        impressions:
          flattenConnection(cart?.lines)?.slice(0, 7).map(mapCartLine(list)) ||
          [],
      },
    };
    // Elevar requires a `dl_user_data` event before `dl_view_cart`
    customerEvent({
      ...data,
      customer: customer || null,
      onEmit: () => emitEvent({event, debug}),
      debug,
    });
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const addToCartEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_ADD_TO_CART;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {cart, currentLine, customer, prevLine, shop} = data;
    if (!cart || !currentLine)
      throw new Error('`cart` and/or `currentLine` parameters are missing.');

    const lineAdded = {
      ...currentLine,
      quantity: (currentLine.quantity || 1) - (prevLine?.quantity || 0),
    };
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list =
      (window.location.pathname.startsWith('/collections') &&
        window.location.pathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const event = {
      event: 'dl_add_to_cart',
      user_properties: generateUserProperties({customer}),
      cart_total: cart.cost?.totalAmount?.amount || '0.0',
      ecommerce: {
        currencyCode: cart.cost?.totalAmount?.currencyCode || shop?.currency,
        add: {
          actionField: {list},
          products: [lineAdded].map(mapCartLine(list)),
        },
      },
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const removeFromCartEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_REMOVED_FROM_CART;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {cart, currentLine, customer, prevLine, shop} = data;
    if (!cart || !prevLine)
      throw new Error('`cart` and/or `prevLine` parameters are missing.');

    const lineRemoved = {
      ...prevLine,
      quantity: (prevLine.quantity || 1) - (currentLine?.quantity || 0),
    };
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list =
      (window.location.pathname.startsWith('/collections') &&
        window.location.pathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const event = {
      event: 'dl_remove_from_cart',
      user_properties: generateUserProperties({customer}),
      cart_total: cart.cost?.totalAmount?.amount || '0.0',
      ecommerce: {
        currencyCode: cart.cost?.totalAmount?.currencyCode || shop?.currency,
        remove: {
          actionField: {list},
          products: [lineRemoved].map(mapCartLine(list)),
        },
      },
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const clickProductItemEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_ITEM_CLICKED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {product, listIndex, searchTerm, customer, shop} = data;
    let {selectedVariant} = data;
    if (!selectedVariant)
      selectedVariant = flattenConnection(product?.variants)?.[0];
    if (!selectedVariant)
      throw new Error('`selectedVariant` parameter is missing.');

    const list = window.location.pathname.startsWith('/collections')
      ? window.location.pathname
      : '';

    const variant = {
      ...selectedVariant,
      image: selectedVariant.image || product?.featuredImage || '',
      index: listIndex,
      product: {
        ...selectedVariant.product,
        vendor: product?.vendor,
        collections: product?.collections,
      },
      list,
    };

    const event = {
      event: 'dl_select_item',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currencyCode: variant.price?.currencyCode || shop?.currency,
        click: {
          actionField: {
            list: searchTerm ? 'search results' : list,
            action: 'click',
            ...(!!searchTerm && {search_term: searchTerm}),
          },
          products: [variant].map(mapProductItemVariant(list)),
        },
      },
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerLogInEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER_LOGGED_IN;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer} = data;
    if (!customer) throw new Error('`customer` parameter is missing.');

    const event = {
      event: 'dl_login',
      user_properties: generateUserProperties({customer}),
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerRegisterEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER_REGISTERED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer} = data;
    if (!customer) throw new Error('`customer` parameter is missing.');

    const event = {
      event: 'dl_sign_up',
      user_properties: generateUserProperties({customer}),
    };
    emitEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerSubscribeEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER_SUBSCRIBED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {email, phone} = data;
    if (!email && !phone)
      throw new Error('`email` or `phone` parameter is missing.');

    if (email) {
      const event = {
        event: 'dl_subscribe',
        lead_type: 'email',
        user_properties: {customer_email: email},
      };
      emitEvent({event, debug});
    }
    if (phone) {
      const event = {
        event: 'dl_subscribe',
        lead_type: 'phone',
        user_properties: {customer_phone: phone},
      };
      emitEvent({event, debug});
    }
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

export {
  addToCartEvent,
  clickProductItemEvent,
  customerEvent,
  customerLogInEvent,
  customerRegisterEvent,
  customerSubscribeEvent,
  emitEvent,
  removeFromCartEvent,
  viewCartEvent,
  viewCollectionEvent,
  viewPageEvent,
  viewProductEvent,
  viewSearchResultsEvent,
};
